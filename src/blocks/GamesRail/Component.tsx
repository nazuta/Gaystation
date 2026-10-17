'use client'

import React, { useRef } from 'react'

import type { GamesRailBlock as GamesRailBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

export const GamesRailBlock: React.FC<GamesRailBlockProps> = ({ heading, games }) => {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('.game')
    const step = (card?.getBoundingClientRect().width || 300) + 20
    track.scrollBy({ behavior: 'smooth', left: step * direction })
  }

  // 3D tilt + moving glare toward the cursor, mirroring concept-static's motion layer
  const handlePointerMove: React.PointerEventHandler<HTMLAnchorElement> = (e) => {
    const ph = e.currentTarget.querySelector<HTMLElement>('.ph')
    if (!ph) return
    const r = ph.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    ph.style.setProperty('--ry', `${(x - 0.5) * 14}deg`)
    ph.style.setProperty('--rx', `${(0.5 - y) * 12}deg`)
    ph.style.setProperty('--gx', `${x * 100}%`)
    ph.style.setProperty('--gy', `${y * 100}%`)
  }

  const handlePointerLeave: React.PointerEventHandler<HTMLAnchorElement> = (e) => {
    const ph = e.currentTarget.querySelector<HTMLElement>('.ph')
    ph?.style.removeProperty('--rx')
    ph?.style.removeProperty('--ry')
  }

  const items = (games || []).filter((game) => typeof game === 'object')

  if (!items.length) return null

  return (
    <section className="sec" id="games">
      <div className="wrap games-head">
        <h2 className="rv font-heading text-[clamp(30px,3.8vw,52px)] leading-[1.08] font-bold tracking-[-.035em]">
          {heading}
        </h2>
        <div className="arrows">
          <button aria-label="Previous" className="icon-btn" onClick={() => scrollByCard(-1)} type="button">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button aria-label="Next" className="icon-btn" onClick={() => scrollByCard(1)} type="button">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="track" ref={trackRef}>
        {items.map((game) => (
          <a
            className="game"
            href="#"
            key={game.id}
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}
          >
            <div className="ph">
              {game.poster && (
                <Media
                  imgClassName="h-full w-full object-cover"
                  resource={game.poster}
                  size="(max-width: 767px) 72vw, 340px"
                />
              )}
            </div>
            <h3>{game.title}</h3>
            {game.tagline && <p>{game.tagline}</p>}
          </a>
        ))}
      </div>
    </section>
  )
}
