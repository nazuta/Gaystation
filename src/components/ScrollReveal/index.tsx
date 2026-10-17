'use client'

import { useEffect } from 'react'

// Ports the reveal-on-scroll behaviour from concept-static/index.html:
// any element with the `.rv` class fades/slides in once it enters the viewport.
export const ScrollReveal: React.FC = () => {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.rv'))
    if (!items.length) return

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    items.forEach((el) => io.observe(el))

    // safety net in case an element never intersects (e.g. very tall viewport)
    const safety = setTimeout(() => items.forEach((el) => el.classList.add('in')), 2500)

    return () => {
      io.disconnect()
      clearTimeout(safety)
    }
  }, [])

  return null
}
