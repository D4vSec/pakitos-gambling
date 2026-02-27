import React from "react";

const Card = ({children, className = "", ...props}) => {
  return (
    <div className={`bg-base-100 rounded-xl border shadow-sm ${className}`} {...props}>
        {children}
    </div>
  );
};

export default Card;
