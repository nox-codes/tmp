import Link from "next/link";
import type { ReactNode, SVGProps } from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  arrowIcon?: boolean;
}

interface ButtonLinkProps extends ButtonBaseProps {
  href: string;
  onClick?: never;
  type?: never;
}

interface ButtonNativeProps extends ButtonBaseProps {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

type ButtonProps = ButtonLinkProps | ButtonNativeProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-700 text-white hover:bg-teal-800 hover:shadow-xl hover:shadow-teal-700/20 active:scale-[0.98]",
  secondary:
    "bg-white text-teal-700 border-2 border-teal-700/20 hover:border-teal-700 hover:bg-teal-50 active:scale-[0.98]",
  accent:
    "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-xl hover:shadow-amber-500/25 active:scale-[0.98]",
  ghost:
    "bg-transparent text-gray-600 hover:text-teal-700 hover:bg-teal-50/50 active:bg-teal-50",
  outline:
    "bg-transparent text-teal-700 border-2 border-teal-200 hover:border-teal-600 hover:bg-teal-50 active:scale-[0.98]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-xs rounded-lg gap-1.5",
  md: "px-6 py-3 text-sm rounded-xl gap-2",
  lg: "px-8 py-4 text-base rounded-xl gap-2.5",
};

const arrowSvg = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export default function Button(props: ButtonProps) {
  const { children, variant = "primary", size = "md", fullWidth, arrowIcon, ...rest } = props;

  const baseClasses = "inline-flex items-center justify-center font-semibold transition-all duration-300 cursor-pointer select-none";
  const widthClass = fullWidth ? "w-full" : "";
  const className = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`;

  if (props.href) {
    return (
      <Link href={props.href} className={className}>
        {children}
        {arrowIcon && arrowSvg}
      </Link>
    );
  }

  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className={className}
    >
      {children}
      {arrowIcon && arrowSvg}
    </button>
  );
}