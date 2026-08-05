const VARIANT_CLASSES = {
  primary:
    "bg-primary text-white hover:bg-primary-dark disabled:bg-ink-faint",
  secondary:
    "bg-primary-soft text-primary hover:bg-white border border-primary/20",
  ghost: "text-ink-soft hover:bg-canvas hover:text-ink",
  outline: "border border-hairline text-ink hover:border-primary hover:text-primary",
};

const SIZE_CLASSES = {
  sm: "text-xs px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2 gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  ...rest
}) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {Icon ? <Icon size={size === "sm" ? 14 : 16} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
