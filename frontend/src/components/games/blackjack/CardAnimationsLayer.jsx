import React, { useEffect } from "react"

const CardAnimationsLayer = ({ dealQueue }) => {
  useEffect(() => {
    console.log("Animation queue:", dealQueue)
  }, [dealQueue])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {dealQueue.map((event) => (
        <div
          key={event.id}
          className="absolute w-20 h-28 bg-red-500 rounded-lg shadow-lg flex items-center justify-center text-white font-bold"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}>
          {event.type}
        </div>
      ))}
    </div>
  )
}

export default CardAnimationsLayer
