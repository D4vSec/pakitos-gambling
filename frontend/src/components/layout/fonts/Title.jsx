import React from "react"

const Title = ({ children, className = "m-4" }) => {
  return (
    <h1 className={`font-bold text-5xl text-center ${className}`}>
      {children}
    </h1>
  )
}

export default Title
