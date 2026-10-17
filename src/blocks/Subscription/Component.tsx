import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { SubscriptionBlock as SubscriptionBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { TierPicker } from './TierPicker'

const COLUMN_COUNT = 3
const TILES_PER_COLUMN = 4

export const SubscriptionBlock = async ({ heading, lead }: SubscriptionBlockProps) => {
  const payload = await getPayload({ config: configPromise })

  const { docs: games } = await payload.find({
    collection: 'games',
    depth: 1,
    limit: 24,
    overrideAccess: false,
    sort: 'order',
  })

  const columns = Array.from({ length: COLUMN_COUNT }, (_, col) =>
    Array.from({ length: TILES_PER_COLUMN }, (_, row) => games[(col * TILES_PER_COLUMN + row) % (games.length || 1)]),
  )

  return (
    <section className="sec plus" id="plus">
      <div className="wrap plus-grid">
        <div aria-hidden="true" className="wall rv">
          {columns.map((col, ci) => (
            <div className="col" key={ci}>
              {/* duplicated once so the looping translateY(-50%) animation reads as seamless */}
              {[...col, ...col].map((game, ri) => (
                <div className="ph" key={ri}>
                  {game?.poster && (
                    // native lazy-loading misjudges visibility under the wall's 3D transform, so load eagerly
                    <Media fill imgClassName="object-cover" loading="eager" resource={game.poster} />
                  )}
                </div>
              ))}
            </div>
          ))}
          <div className="wall-badge">
            <div className="big">
              {games.length}
              <small>+</small>
            </div>
            <p>games ready to download</p>
          </div>
        </div>

        <div>
          <h2 className="rv font-heading text-[clamp(30px,3.8vw,52px)] leading-[1.08] font-bold tracking-[-.035em]">
            {heading}
          </h2>
          {lead && (
            <p
              className="lead rv mt-4 max-w-[56ch] text-[17px]"
              style={{ '--i': 1, color: 'var(--muted-foreground)' } as React.CSSProperties}
            >
              {lead}
            </p>
          )}
          <TierPicker />
        </div>
      </div>
    </section>
  )
}
