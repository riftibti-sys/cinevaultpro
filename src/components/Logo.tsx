import logoAsset from "@/assets/cinevault-logo.jpg.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2.5 leading-none ${className}`}>
      <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl bg-black shadow-[0_6px_18px_-8px_rgba(0,0,0,.4)] ring-1 ring-black/10 sm:h-12 sm:w-12">
        <img
          src={logoAsset.url}
          alt="CineVault"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="async"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-xl font-extrabold tracking-tight text-foreground sm:text-[22px]">
          Cine<span className="text-primary">Vault</span>
        </span>
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Premium Subscriptions
        </span>
      </span>
    </div>
  );
}
