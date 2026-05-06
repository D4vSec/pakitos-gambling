import React from "react"

const Desc = ({ children }) => {
  return (
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
      {children}
    </p>
  )
}

export default Desc
