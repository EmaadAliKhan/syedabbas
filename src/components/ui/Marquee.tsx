import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
}

export default function Marquee({
  children,
  reverse = false,
  className = "",
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden border-y border-border py-3 ${className}`}
      aria-hidden="true"
    >
      <div
        className={`flex w-max gap-8 whitespace-nowrap ${
          reverse ? "animate-[marquee-reverse_28s_linear_infinite]" : "animate-[marquee_28s_linear_infinite]"
        }`}
      >
        <div className="flex shrink-0 items-center gap-8">{children}</div>
        <div className="flex shrink-0 items-center gap-8">{children}</div>
      </div>
    </div>
  );
}
