import React from "react";

const variants = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "info",
  "success",
  "warning",
  "error",
];

const Button = ({ children, variant = "primary", size, ...props }) => {
  const safeVariant = variants.includes(variant) ? variant : "primary";
  return (
    <button
      className={`btn btn-${safeVariant} ${size ? `btn-${size}` : ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
