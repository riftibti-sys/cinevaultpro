export function Logo({ className = "" }: { className?: string }) {
  // "Cine" + soccer ball as the "V" pivot + "ault"  with "vault" script beneath
  return (
    <div className={`inline-flex flex-col items-center leading-none ${className}`}>
      <div className="flex items-end gap-[2px] text-2xl font-extrabold tracking-tight sm:text-[26px]">
        <span className="text-foreground">Cine</span>
        <span className="text-primary">Va</span>
        {/* soccer ball replacing the "u" */}
        <span className="relative inline-block h-[1.05em] w-[1.05em] -mx-[1px] align-baseline">
          <svg viewBox="0 0 40 40" className="cv-ball absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <radialGradient id="cvBallG" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="60%" stopColor="#e5e5e5" />
                <stop offset="100%" stopColor="#9a9a9a" />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#cvBallG)" stroke="#111" strokeWidth="1.2" />
            <polygon points="20,10 27,15 24.5,23 15.5,23 13,15" fill="#111" />
            <path d="M20,10 L20,3 M27,15 L34,12 M24.5,23 L30,29 M15.5,23 L10,29 M13,15 L6,12"
                  stroke="#111" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </svg>
        </span>
        <span className="text-primary">lt</span>
      </div>
      {/* soft cast shadow — no filter blur, uses radial gradient for cheap paint */}
      <span
        className="cv-shadow mt-[3px] block h-[4px] w-8 rounded-full"
        style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,.7) 0%, rgba(0,0,0,0) 70%)" }}
      />
      <span className="cv-script -mt-[6px] text-[13px] text-primary/90">cine vault</span>
    </div>
  );
}
