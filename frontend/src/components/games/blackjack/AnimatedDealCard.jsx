import React, { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import Card from "./Card"

const getCenter = (rect) => ({
  top: rect.top + rect.height / 2,
  left: rect.left + rect.width / 2,
})

const AnimatedDealCard = ({
  event,
  isLastEvent,
  deckRef,
  cardRefs,
  cardRectsRef,
  onCardStateChange,
  onEventComplete,
  travelDuration,
  valueRevealDelay,
  nextDealDelay,
}) => {
  const cardRef = useRef(null)
  const onCardStateChangeRef = useRef(onCardStateChange)
  const onEventCompleteRef = useRef(onEventComplete)

  useLayoutEffect(() => {
    onCardStateChangeRef.current = onCardStateChange
    onEventCompleteRef.current = onEventComplete
  }, [onCardStateChange, onEventComplete])

  useLayoutEffect(() => {
    const animatedCard = cardRef.current
    const targetCard = cardRefs.current?.[event.card.id]
    const timers = []
    const setManagedTimeout = (callback, delay) => {
      const timer = setTimeout(callback, delay)
      timers.push(timer)
      return timer
    }

    if (!animatedCard || !targetCard) {
      setManagedTimeout(() => {
        onCardStateChangeRef.current(
          event.card.id,
          event.reveal ? "faceUp" : "faceDown",
        )
        onEventCompleteRef.current(event.id)
      }, 0)

      return () => timers.forEach(clearTimeout)
    }

    const deckRect = deckRef.current?.getBoundingClientRect()
    const start = deckRect ? getCenter(deckRect) : { top: 0, left: 0 }
    const targetRect = targetCard.getBoundingClientRect()
    const end = getCenter(targetRect)
    const rotation = event.to === "dealer" ? -5 : 5

    gsap.set(animatedCard, {
      x: start.left,
      y: start.top,
      xPercent: -50,
      yPercent: -50,
      rotate: rotation,
      scale: 1,
      opacity: 1,
    })

    const timeline = gsap.timeline({
      onComplete: () => {
        cardRectsRef.current[event.card.id] = targetRect
        onCardStateChangeRef.current(event.card.id, "faceDown")

        if (!event.reveal) {
          onEventCompleteRef.current(event.id)
          return
        }

        setManagedTimeout(() => {
          onCardStateChangeRef.current(event.card.id, "faceUp")

          if (isLastEvent) {
            onEventCompleteRef.current(event.id)
          }
        }, valueRevealDelay)

        if (!isLastEvent) {
          setManagedTimeout(() => {
            onEventCompleteRef.current(event.id)
          }, nextDealDelay * 1000)
        }
      },
    })

    timeline.to(animatedCard, {
      x: end.left,
      y: end.top,
      rotate: 0,
      duration: travelDuration,
      ease: "power2.inOut",
    })

    return () => {
      timeline.kill()
      timers.forEach(clearTimeout)
    }
  }, [
    cardRefs,
    cardRectsRef,
    deckRef,
    event,
    isLastEvent,
    nextDealDelay,
    travelDuration,
    valueRevealDelay,
  ])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div
        ref={cardRef}
        className="fixed left-0 top-0"
        style={{ transform: "translate(-50%, -50%)" }}>
        <Card card={event.card} forceHidden={false} flipped={false} />
      </div>
    </div>
  )
}

export default AnimatedDealCard
