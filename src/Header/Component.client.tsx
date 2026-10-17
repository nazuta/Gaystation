'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'

interface HeaderClientProps {
  data: Header
}

const resolveHref = (link: NonNullable<Header['navItems']>[number]['link']) => {
  if (link.type === 'custom') return link.url || ''
  if (typeof link.reference?.value === 'object' && link.reference.value.slug) {
    return link.reference.relationTo === 'pages' ? `/${link.reference.value.slug}` : `/posts/${link.reference.value.slug}`
  }
  return ''
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeHref, setActiveHref] = useState<string | null>(null)
  const navLinksRef = useRef<HTMLDivElement>(null)
  const hoverPillRef = useRef<HTMLSpanElement>(null)
  const [mounted, setMounted] = useState(false)

  const navItems = data?.navItems || []

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  // compact nav once the page has scrolled a bit
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // highlight the nav link matching the section currently in view
  useEffect(() => {
    const hashTargets = navItems
      .map((item) => resolveHref(item.link))
      .filter((href) => href.startsWith('#'))
      .map((href) => href.slice(1))

    if (!hashTargets.length || !('IntersectionObserver' in window)) return

    const sections = hashTargets
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [navItems])

  // lock scroll while the mobile sheet is open
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const handleLinkHover: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    const pill = hoverPillRef.current
    if (!pill) return
    pill.style.width = `${e.currentTarget.offsetWidth}px`
    pill.style.transform = `translateX(${e.currentTarget.offsetLeft}px)`
    pill.style.opacity = '1'
  }

  return (
    <header
      className={scrolled ? 'scrolled' : ''}
      id="hdr"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <nav aria-label="Main navigation">
        <Link className="wordmark" href="/">
          <span aria-hidden="true" className="mark">
            G
          </span>
          GayStation
        </Link>

        <div className="nav-links" onMouseLeave={() => hoverPillRef.current && (hoverPillRef.current.style.opacity = '0')} ref={navLinksRef}>
          <span aria-hidden="true" className="nav-hover" ref={hoverPillRef} />
          {navItems.map((item, i) => {
            const href = resolveHref(item.link)
            return (
              <a
                className={href === activeHref ? 'active' : ''}
                href={href}
                key={i}
                onMouseEnter={handleLinkHover}
              >
                {item.link.label}
              </a>
            )
          })}
        </div>

        <div className="nav-right">
          <Link aria-label="Search" className="icon-btn" href="/search">
            <svg className="i" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </Link>
          <button aria-label="Cart, 2 items" className="icon-btn cart" type="button">
            <svg className="i" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <path d="M3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            <b>2</b>
          </button>
          <CMSLink appearance="inline" className="btn btn-primary" label="Sign in" url="/admin" />
          <button
            aria-controls="sheet"
            aria-expanded={menuOpen}
            aria-label="Menu"
            className="icon-btn menu-btn"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <svg className="i bars" viewBox="0 0 24 24">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            <svg className="i x" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </nav>

      {mounted &&
        createPortal(
          <div aria-hidden={!menuOpen} className="sheet" id="sheet">
            <nav aria-label="Mobile navigation" className="sheet-links">
              {navItems.map((item, i) => (
                <a href={resolveHref(item.link)} key={i} onClick={() => setMenuOpen(false)}>
                  {item.link.label}
                </a>
              ))}
            </nav>
            <CMSLink appearance="inline" className="btn btn-primary" label="Sign in" url="/admin" />
          </div>,
          document.body,
        )}
    </header>
  )
}
