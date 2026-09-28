// Chest / loot marker extractor — CUE4Parse spike.
//
// Mounts Fortnite's encrypted paks, scans the Battle Royale island's World
// Partition packages, pulls the world-space location of placed chest / ammo /
// vehicle actors, normalizes them to 0..1 map-image coordinates, and writes a
// loot-markers.json the site can consume.
//
// This is a SPIKE. It is written to be correct and idiomatic, but three things
// are version-sensitive and marked `CONFIG:` — they are the per-patch upkeep the
// README talks about. Exact CUE4Parse type/property names can shift between
// library versions; if a build breaks after a submodule bump, those are the
// first places to look.

using System.Text.Json;
using CUE4Parse.Encryption.Aes;
using CUE4Parse.FileProvider;
using CUE4Parse.UE4.Assets.Exports;
using CUE4Parse.UE4.Assets.Objects;
using CUE4Parse.UE4.Objects.Core.Math;
using CUE4Parse.UE4.Objects.Core.Misc;
using CUE4Parse.UE4.Objects.UObject;
using CUE4Parse.UE4.Versions;

// ---------------------------------------------------------------------------
// Args
// ---------------------------------------------------------------------------
var opts = Args.Parse(args);
if (opts is null) { Args.PrintUsage(); return 1; }

Console.WriteLine($"[extract] paks : {opts.PaksDir}");
Console.WriteLine($"[extract] ue   : {opts.Game}");
Console.WriteLine($"[extract] out  : {opts.OutPath}");

// ---------------------------------------------------------------------------
// CONFIG: what counts as a chest / ammo / vehicle.
// Epic renames these blueprints from time to time. If marker counts crater
// after a patch, verify these fragments against the current game files in FModel.
// Matching is case-insensitive "class name contains fragment".
// ---------------------------------------------------------------------------
var targetClasses = new Dictionary<string, string[]>
{
    ["chest"]   = new[] { "Tiered_Chest", "TieredChest", "AthenaChest", "Chest_Athena" },
    ["ammo"]    = new[] { "AmmoBox", "Tiered_Ammo", "AmmoCan" },
    ["vehicle"] = new[] { "Vehicle_Spawner", "ValetSpawner", "VehicleSpawn" },
};

// ---------------------------------------------------------------------------
// CONFIG: which package roots hold the CURRENT BR island's placed actors.
// World Partition scatters actors across many generated streaming-cell packages,
// so we scan by prefix rather than loading one level. Confirm the active path in
// FModel each new map (it changes with chapters / big map reworks).
// ---------------------------------------------------------------------------
var mapContentRoots = new[]
{
    "FortniteGame/Plugins/GameFeatures/BattleRoyale/Content/Athena/Apollo/Maps",
    "FortniteGame/Content/Athena/Apollo/Maps",
};

// ---------------------------------------------------------------------------
// Mount the game
// ---------------------------------------------------------------------------
var provider = new DefaultFileProvider(
    directory: opts.PaksDir,
    searchOption: SearchOption.AllDirectories,
    isCaseInsensitive: true,
    versions: new VersionContainer(opts.Game));

provider.Initialize();
provider.SubmitKey(new FGuid(), new FAesKey(opts.AesKey)); // main key; add SubmitKeys for extra dynamic keys if needed
provider.LoadVirtualPaths();
Console.WriteLine($"[extract] mounted {provider.Files.Count} files");

// ---------------------------------------------------------------------------
// Scan
// ---------------------------------------------------------------------------
var transform = new MapTransform(MapTransform.WorldBounds);
var layers = new Dictionary<string, List<Marker>>
{
    ["chest"] = new(), ["ammo"] = new(), ["vehicle"] = new(),
};

var candidatePackages = provider.Files.Keys
    .Where(p => p.EndsWith(".umap") && mapContentRoots.Any(r => p.StartsWith(r, StringComparison.OrdinalIgnoreCase)))
    .ToList();

Console.WriteLine($"[extract] scanning {candidatePackages.Count} map packages...");

foreach (var path in candidatePackages)
{
    IReadOnlyList<UObject> exports;
    try { exports = provider.LoadAllObjects(path).ToList(); }
    catch { continue; } // a package that fails to parse shouldn't kill the run

    foreach (var export in exports)
    {
        var className = export.Class?.Name ?? export.ExportType;
        if (string.IsNullOrEmpty(className)) continue;

        var kind = ClassifyActor(className, targetClasses);
        if (kind is null) continue;

        if (TryGetWorldLocation(export, out var loc))
        {
            var (nx, ny) = transform.ToNormalized(loc.X, loc.Y);
            if (nx is < 0 or > 1 || ny is < 0 or > 1) continue; // off-island / not on the shown map
            layers[kind].Add(new Marker(kind, Math.Round(nx, 4), Math.Round(ny, 4)));
        }
    }
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------
var output = new
{
    generatedAt = DateTime.UtcNow.ToString("o"),
    game = new { paks = Path.GetFileName(opts.PaksDir), ue = opts.Game.ToString() },
    map = new
    {
        worldBounds = MapTransform.WorldBounds,
        note = "x/y are normalized 0..1, origin top-left; multiply by your map image pixel size.",
    },
    counts = layers.ToDictionary(kv => kv.Key + "s", kv => kv.Value.Count),
    layers = layers.ToDictionary(kv => kv.Key + "s", kv => kv.Value),
};

var json = JsonSerializer.Serialize(output, new JsonSerializerOptions { WriteIndented = true });
File.WriteAllText(opts.OutPath, json);

Console.WriteLine("[extract] done:");
foreach (var kv in layers) Console.WriteLine($"           {kv.Key,-8} {kv.Value.Count}");
if (layers.Values.All(v => v.Count == 0))
    Console.WriteLine("[extract] WARNING: zero markers — check TargetClasses / MapContentRoots / AES key.");
return 0;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
static string? ClassifyActor(string className, Dictionary<string, string[]> targets)
{
    foreach (var (kind, fragments) in targets)
        if (fragments.Any(f => className.Contains(f, StringComparison.OrdinalIgnoreCase)))
            return kind;
    return null;
}

// A placed actor's world position lives on its root scene component's
// RelativeLocation. We resolve RootComponent, then read RelativeLocation (an
// FVector struct property). Falls back to a direct RelativeLocation on the actor.
static bool TryGetWorldLocation(UObject actor, out FVector location)
{
    location = default;

    if (actor.TryGetValue(out FPackageIndex root, "RootComponent") &&
        root.TryLoad(out UObject? rootComp) && rootComp is not null &&
        rootComp.TryGetValue(out FVector rl, "RelativeLocation"))
    {
        location = rl;
        return true;
    }

    if (actor.TryGetValue(out FVector direct, "RelativeLocation"))
    {
        location = direct;
        return true;
    }

    return false;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
record Marker(string type, double x, double y);

// World-units -> normalized 0..1 image coordinates.
// CONFIG: WorldBounds is the calibration that must match the CURRENT minimap.
// Y is flipped because image Y grows downward while UE world Y grows "north".
sealed class MapTransform
{
    // CONFIG: recalibrate per map. Rough Apollo-era defaults; verify against the
    // in-game minimap bounds (or solve from a couple of known POIs).
    public static readonly Bounds WorldBounds = new(MinX: -135000, MaxX: 135000, MinY: -135000, MaxY: 135000);

    readonly Bounds _b;
    public MapTransform(Bounds b) => _b = b;

    public (double x, double y) ToNormalized(double worldX, double worldY)
    {
        var nx = (worldX - _b.MinX) / (_b.MaxX - _b.MinX);
        var ny = 1.0 - (worldY - _b.MinY) / (_b.MaxY - _b.MinY); // flip Y for image space
        return (nx, ny);
    }

    public readonly record struct Bounds(double MinX, double MaxX, double MinY, double MaxY);
}

// ---------------------------------------------------------------------------
// Minimal arg parsing
// ---------------------------------------------------------------------------
sealed class Args
{
    public required string PaksDir { get; init; }
    public required string AesKey { get; init; }
    public required string OutPath { get; init; }
    public required EGame Game { get; init; }

    public static Args? Parse(string[] a)
    {
        string? paks = null, aes = null, @out = "loot-markers.json", ue = "GAME_UE5_6";
        for (var i = 0; i < a.Length - 1; i++)
        {
            switch (a[i])
            {
                case "--paks": paks = a[++i]; break;
                case "--aes":  aes = a[++i]; break;
                case "--out":  @out = a[++i]; break;
                case "--ue":   ue = a[++i]; break;
            }
        }
        if (paks is null || aes is null) return null;
        if (!Enum.TryParse<EGame>(ue, ignoreCase: true, out var game)) game = EGame.GAME_UE5_6;
        return new Args { PaksDir = paks, AesKey = aes, OutPath = @out, Game = game };
    }

    public static void PrintUsage() => Console.WriteLine(
        "usage: dotnet run -- --paks <PaksDir> --aes 0x<key> [--ue GAME_UE5_6] [--out loot-markers.json]");
}
