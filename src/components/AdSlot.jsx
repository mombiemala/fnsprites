import { useEffect, useRef } from 'react'
import { AD_CLIENT, ADS_ENABLED } from '../lib/ads'

/**
 * A single AdSense ad unit.
 *
 * Renders NOTHING until both (a) ADS_ENABLED is true and (b) a real `slot` id
 * is provided — so these can be dropped into the layout now and switched on
 * later with an env var + slot ids, with zero visual impact in the meantime.
 * Config (publisher id, master switch, slot ids) lives in src/lib/ads.js.
 *
 * @param {string} slot    AdSense ad-unit id (data-ad-slot).
 * @param {string} format  "auto" (responsive, default) or a fixed AdSense format.
 * @param {boolean} label  Show a small "Advertisement" label above the unit.
 */
export default function AdSlot({ slot, format = 'auto', className = '', style, label = true }) {
  const pushed = useRef(false)

  useEffect(() => {
    if (!ADS_ENABLED || !slot || pushed.current) return
    try {
      // Ask AdSense to fill this <ins>. The array is created by the loader script.
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      /* loader blocked (ad blocker) or not ready — fail silently, no broken UI */
    }
  }, [slot])

  // Dormant: don't render an empty placeholder or reserve layout space.
  if (!ADS_ENABLED || !slot) return null

  return (
    <div className={`my-4 text-center ${className}`} style={style}>
      {label && (
        <div className="mb-1 text-[10px] uppercase tracking-wider opacity-40">Advertisement</div>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
