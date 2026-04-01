import { BRAND_LOGO_TEXT } from "@/lib/brand";

export type BrandWordmarkSurface = "hero" | "light" | "card";

type Props = {
  surface: BrandWordmarkSurface;
  className?: string;
};

/** Açık/cam zemin üzerinde beyaz yazı okunurluğu */
const textShadowWhite =
  "[text-shadow:0_1px_3px_rgba(0,0,0,0.9),0_0_14px_rgba(0,0,0,0.45)]";

/**
 * PATİ siyah; SİD ve Sokak Dostları beyaz (kart / üst bar için gölge ile)
 */
export function BrandWordmark({ surface, className = "" }: Props) {
  const isHero = surface === "hero";
  const isCard = surface === "card";
  const isLight = surface === "light";

  const patiClass = isHero
    ? "text-zinc-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.45)]"
    : isLight
      ? "text-zinc-900"
      : "text-zinc-900";

  const stackSize =
    isCard || isLight
      ? "text-3xl font-black tracking-tight sm:text-4xl"
      : "text-xl font-black tracking-tight sm:text-2xl";

  const sidClass = isHero
    ? `${stackSize} text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]`
    : isLight
      ? `${stackSize} text-zinc-800`
      : `${stackSize} text-white ${textShadowWhite}`;

  const sokakClass = isHero
    ? "text-white drop-shadow-sm"
    : isLight
      ? "text-zinc-600"
      : `text-white ${textShadowWhite}`;

  const sokakSize =
    isCard || isLight
      ? "text-sm font-semibold leading-snug sm:text-base"
      : "text-[0.7rem] font-semibold leading-tight sm:text-xs md:text-sm";

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 ${className}`.trim()}
      role="img"
      aria-label={BRAND_LOGO_TEXT}
    >
      <div className="inline-flex flex-col items-stretch leading-[0.88]">
        <span className={`${stackSize} ${patiClass}`}>PATİ</span>
        <span className="w-full text-center">
          <span className={sidClass}>SİD</span>
        </span>
      </div>
      <span
        className={`${sokakSize} max-w-[9rem] sm:max-w-[11rem] ${sokakClass}`}
      >
        Sokak Dostları
      </span>
    </div>
  );
}
