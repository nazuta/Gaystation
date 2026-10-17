'use client'

import React, { useRef } from 'react'

import type { FinaleBlock as FinaleBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'

export const FinaleBlock: React.FC<FinaleBlockProps> = ({ topWord, bottomWord, lead, link, padImage }) => {
  const sectionRef = useRef<HTMLElement>(null)
  const padRef = useRef<HTMLDivElement>(null)

  const handlePointerMove: React.PointerEventHandler<HTMLElement> = (e) => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const section = sectionRef.current
    const pad = padRef.current
    if (!section || !pad) return
    const r = section.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    pad.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 16}deg)`
  }

  const handlePointerLeave = () => {
    if (padRef.current) padRef.current.style.transform = ''
  }

  return (
    <section
      className="finale"
      id="finale"
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      ref={sectionRef}
    >
      <div className="stage">
        <span aria-hidden="true" className="word top rv">
          {topWord}
        </span>
        <div className="pad-wrap">
          <div className="pad-tilt" ref={padRef}>
            {padImage && typeof padImage === 'object' && (
              <Media
                fill
                imgClassName="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,.6)]"
                resource={padImage}
              />
            )}
          </div>
        </div>
        <span aria-hidden="true" className="word bot rv" style={{ '--i': 1 } as React.CSSProperties}>
          {bottomWord}
        </span>
      </div>
      <div className="finale-foot rv" style={{ '--i': 2 } as React.CSSProperties}>
        <h2 className="sr-only">
          {topWord} {bottomWord}
        </h2>
        {lead && <p>{lead}</p>}
        <CMSLink appearance="inline" className="btn btn-primary" {...link}>
          <svg className="i" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </CMSLink>
      </div>
    </section>
  )
}
