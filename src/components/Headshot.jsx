import { useState } from 'react';

const HEADSHOT_SRC = '/headshot.webp';

export default function Headshot({
  alt = 'Kamala Espig',
  className = 'h-20 w-20',
  imgClassName = '',
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div
        className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-slate-700 via-indigo-600 to-violet-500 text-sm font-semibold tracking-wide text-white"
        aria-hidden={!failed}
      >
        KE
      </div>
      {!failed && (
        <img
          src={HEADSHOT_SRC}
          alt={alt}
          className={`relative z-10 h-full w-full rounded-full object-cover ${imgClassName}`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
