import React, { useRef, useEffect } from "react"
import gsap from "gsap"
import cherryImg from "@/assets/games/cherry3x3.jpg"
import lemonImg from "@/assets/games/lemon3x3.jpg"
import orangeImg from "@/assets/games/orange3x3.jpg"
import plumImg from "@/assets/games/plum3x3.jpg"
import bellImg from "@/assets/games/bell3x3.jpg"
import barImg from "@/assets/games/bar3x3.jpg"
import sevenImg from "@/assets/games/seven3x3.jpg"

const SYMBOL_DISPLAY = {
  cherry: cherryImg,
  lemon: lemonImg,
  orange: orangeImg,
  plum: plumImg,
  bell: bellImg,
  bar: barImg,
  seven: sevenImg,
}

const SlotCell = ({ symbol, isWinning = false, animKey, isLanding = false }) => {
  const symbolRef = useRef(null)
  const cellRef = useRef(null)

  useEffect(() => {
    if (!symbolRef.current) return
    gsap.killTweensOf(symbolRef.current)

    if (isLanding) {
      gsap.fromTo(
        symbolRef.current,
        { y: "-110%", opacity: 0.5 },
        { y: 0, opacity: 1, duration: 0.52, ease: "power3.out" },
      )
    } else {
      gsap.fromTo(
        symbolRef.current,
        { y: "-110%", opacity: 0.5 },
        { y: 0, opacity: 1, duration: 0.09, ease: "power1.out" },
      )
    }
  }, [animKey, isLanding])

  useEffect(() => {
    if (!cellRef.current) return
    if (isWinning) {
      gsap.fromTo(
        cellRef.current,
        { scale: 1 },
        { scale: 1.04, duration: 0.4, repeat: -1, yoyo: true, ease: "power2.inOut" },
      )
    } else {
      gsap.killTweensOf(cellRef.current)
      gsap.set(cellRef.current, { scale: 1 })
    }
    return () => {
      if (cellRef.current) {
        gsap.killTweensOf(cellRef.current)
        gsap.set(cellRef.current, { scale: 1 })
      }
    }
  }, [isWinning])

  return (
    <div
      ref={cellRef}
      className={`
        relative w-full aspect-square overflow-hidden rounded-lg border-2 select-none
        transition-colors duration-300
        ${isWinning
          ? "border-success bg-success/15 shadow-lg shadow-success/40"
          : "border-neutral-700 bg-neutral-800"
        }
      `}
    >
      {symbol ? (
        <span
          ref={symbolRef}
          className="absolute inset-0 flex items-center justify-center text-4xl font-bold"
        >
          {SYMBOL_DISPLAY[symbol] ?? symbol}
        </span>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-xl opacity-20 text-neutral-400">
          ?
        </span>
      )}
    </div>
  )
}

export default SlotCell
