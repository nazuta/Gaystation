import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

const COLUMN_HEADINGS = ['Games', 'Services', 'Support']

const resolveHref = (link: NonNullable<FooterType['navItems']>[number]['link']) => {
  if (link.type === 'custom') return link.url || ''
  if (typeof link.reference?.value === 'object' && link.reference.value.slug) {
    return link.reference.relationTo === 'pages'
      ? `/${link.reference.value.slug}`
      : `/posts/${link.reference.value.slug}`
  }
  return ''
}

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const columns: (typeof navItems)[] = [[], [], []]
  navItems.forEach((item, i) => columns[i % 3].push(item))

  return (
    <footer id="gs-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="wordmark" href="/" style={{ color: 'var(--foreground)' }}>
              GayStation
            </Link>
            <p style={{ marginTop: 12, maxWidth: '34ch' }}>
              A parody fan concept made for a portfolio. Not affiliated with Sony Interactive
              Entertainment.
            </p>
          </div>

          {COLUMN_HEADINGS.map((heading, ci) => (
            <div key={heading}>
              <h5>{heading}</h5>
              <ul>
                {columns[ci].map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink appearance="inline" label={link.label} url={resolveHref(link)} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="legal">
          <span>Concept, 2026. Non-commercial project.</span>
          <span>Most game titles are fictional.</span>
        </div>
      </div>
    </footer>
  )
}
