import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "ghost" | "outline";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#e8e4d8] text-[#050505] hover:bg-[#9ddbb6] border border-[#e8e4d8]",
  ghost: "bg-transparent text-[#e8e4d8] hover:text-[#9ddbb6] border-transparent",
  outline:
    "bg-transparent text-[#e8e4d8] border border-[#e8e4d8]/40 hover:border-[#9ddbb6] hover:text-[#9ddbb6]",
};

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
}

interface ButtonLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  variant?: ButtonVariant;
}

const baseClasses =
  "tap-target inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 text-[10px] font-medium uppercase tracking-[0.2em] transition-colors duration-300";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
