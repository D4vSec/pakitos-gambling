import React from "react";

const variantMap = {
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  neutral: "badge-neutral",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
};

const sizeMap = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

const Badge = ({ children, variant = "primary", size = "md", className = "", svg }) => {
  const safeVariant = variantMap[variant] || variantMap.primary;
  const safeSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`badge ${safeVariant} ${safeSize} ${className} flex items-center gap-1 rounded-lg`}>
      {svg && <span className="inline-flex">{svg}</span>}
      {children}
    </div>
  );
};

export default Badge;