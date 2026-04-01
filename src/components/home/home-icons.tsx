import type { SVGProps } from "react";

const s = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconMap(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        {...s}
        d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z"
      />
      <circle {...s} cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function IconTasks(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        {...s}
        d="M9 11l2 2 4-4M21 12v6a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h7a2 2 0 012 2v1"
      />
    </svg>
  );
}

export function IconCamera(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        {...s}
        d="M4 8h3l2-2h6l2 2h3a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2z"
      />
      <circle {...s} cx="12" cy="13" r="3" />
    </svg>
  );
}

export function IconAddPin(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...s} d="M12 5v14M5 12h14" />
      <circle {...s} cx="12" cy="12" r="9" />
    </svg>
  );
}

export function IconTrophy(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path {...s} d="M4 20h16" />
      <path {...s} d="M7 20V12h3v8M13 20V8h3v12M19 20V14h-3v6" />
    </svg>
  );
}
