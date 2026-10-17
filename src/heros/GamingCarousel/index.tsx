'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useRef, useState } from 'react'

import type { Page } from '@/payload-types'

import { Media } from '@/components/Media'

const SLIDE_DURATION_MS = 7000

export const GamingCarouselHero: React.FC<Page['hero']> = ({ games }) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  const slides = (games || []).filter((game) => typeof game === 'object')

  useEffect(() => {
    if (paused || slides.length < 2) return

    timerRef.current = setTimeout(() => {
      setActive((current) => (current + 1) % slides.length)
    }, SLIDE_DURATION_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [active, paused, slides.length])

  if (!slides.length) return null

  return (
    <div
      className="hero relative -mt-[6.5rem] flex min-h-[100dvh] items-end overflow-hidden pb-12 isolate"
      data-theme="dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="absolute inset-0 -z-20">
        {slides.map((game, i) => (
          <div
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-[var(--ease-gs)]"
            key={game.id}
            style={{ opacity: i === active ? 1 : 0 }}
          >
            {(game.heroBackground || game.poster) && (
              <Media
                fill
                imgClassName="object-cover"
                priority={i === 0}
                resource={game.heroBackground || game.poster}
              />
            )}
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(6,8,13,.92) 0%, rgba(6,8,13,.55) 38%, rgba(6,8,13,0) 70%), linear-gradient(0deg, var(--background) 0%, rgba(6,8,13,.55) 22%, rgba(6,8,13,0) 50%), linear-gradient(180deg, rgba(6,8,13,.6), rgba(6,8,13,0) 18%)',
        }}
      />

      <div className="wrap grid w-full grid-cols-1 items-end gap-10 md:grid-cols-[1fr_auto]">
        <div className="grid">
          {slides.map((game, i) => (
            <div
              className="col-start-1 row-start-1 transition-[opacity,transform] duration-700 ease-[var(--ease-gs)]"
              key={game.id}
              style={{
                opacity: i === active ? 1 : 0,
                pointerEvents: i === active ? 'auto' : 'none',
                transform: i === active ? 'none' : 'translateY(18px)',
                transitionDelay: i === active ? '250ms' : '0ms',
              }}
            >
              {game.kicker && (
                <span className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[#cfe2ff]">
                  <b className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold tracking-[.08em] text-white uppercase">
                    {game.kicker}
                  </b>
                </span>
              )}
              <h1 className="font-heading mt-4 max-w-[10ch] text-[clamp(46px,7.4vw,118px)] leading-[.92] font-bold tracking-[-.055em] text-balance">
                {game.title}
              </h1>
              {game.description && (
                <p className="mt-5 max-w-[40ch] text-[17px] text-[#c3cddd]">{game.description}</p>
              )}
              <div className="mt-7 flex flex-wrap gap-3">
                <a className="btn btn-primary" href="#games">
                  View in library
                  <svg className="i" viewBox="0 0 24 24">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <div className="hidden gap-3 md:flex">
            {slides.map((game, i) => (
              <button
                className="group w-[150px] cursor-pointer border-0 bg-none p-0 text-left font-inherit text-foreground"
                key={game.id}
                onClick={() => setActive(i)}
                type="button"
              >
                <span
                  className="block overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.14)] transition-opacity duration-300"
                  style={{
                    aspectRatio: '16/10',
                    boxShadow:
                      i === active
                        ? 'inset 0 0 0 2px var(--primary-hi)'
                        : 'inset 0 0 0 1px rgba(255,255,255,.14)',
                    opacity: i === active ? 1 : 0.55,
                  }}
                >
                  {game.poster && (
                    <Media
                      className="h-full w-full"
                      imgClassName="h-full w-full object-cover"
                      resource={game.poster}
                    />
                  )}
                </span>
                <small
                  className="mt-2.5 block text-[13px] font-semibold"
                  style={{ color: i === active ? 'var(--foreground)' : 'var(--muted-foreground)' }}
                >
                  {game.title}
                </small>
                <span className="mt-2 block h-0.5 overflow-hidden rounded-full bg-white/10">
                  {i === active && (
                    <i
                      className="block h-full origin-left bg-primary-hi not-italic"
                      key={`${game.id}-${active}-${paused}`}
                      style={{
                        animation: paused
                          ? 'none'
                          : `gs-progress ${SLIDE_DURATION_MS}ms linear forwards`,
                      }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes gs-progress {
          from { transform: scaleX(0) }
          to { transform: scaleX(1) }
        }
      `}</style>
    </div>
  )
}
