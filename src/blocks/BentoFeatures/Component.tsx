import React from 'react'

import type { BentoFeaturesBlock as BentoFeaturesBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

const CELL_CLASSES = ['cell b-pad', 'cell b-ssd', 'cell b-audio', 'cell b-res ph', 'cell b-remote ph', 'cell b-console']

export const BentoFeaturesBlock: React.FC<BentoFeaturesBlockProps> = ({ heading, lead, cells }) => {
  return (
    <section className="sec" id="console">
      <div className="wrap">
        <h2 className="rv font-heading text-[clamp(30px,3.8vw,52px)] leading-[1.08] font-bold tracking-[-.035em]">
          {heading}
        </h2>
        {lead && (
          <p className="lead rv mt-4 max-w-[56ch] text-[17px]" style={{ color: 'var(--muted-foreground)' }}>
            {lead}
          </p>
        )}

        <div className="bento">
          {cells.slice(0, 6).map((cell, i) => (
            <div className={`${CELL_CLASSES[i]} rv`} key={cell.id || i} style={{ '--i': i } as React.CSSProperties}>
              {/* background art for the two photo-style cells (b-res, b-remote) */}
              {CELL_CLASSES[i].includes('ph') && cell.image && (
                <Media fill imgClassName="-z-[2] object-cover" resource={cell.image} />
              )}

              {i === 0 && (
                <>
                  {cell.image && (
                    <div className="render">
                      <Media imgClassName="float" resource={cell.image} />
                    </div>
                  )}
                  {!!cell.tags?.length && (
                    <div className="tags">
                      {cell.tags.map((tag, ti) => (
                        <span key={tag.id || ti}>{tag.label}</span>
                      ))}
                    </div>
                  )}
                  <div>
                    <h3>{cell.heading}</h3>
                    {cell.body && <p>{cell.body}</p>}
                  </div>
                </>
              )}

              {i === 1 && (
                <>
                  {cell.stat && <div className="big">{cell.stat}</div>}
                  <div>
                    <h3>{cell.heading}</h3>
                    {cell.body && <p>{cell.body}</p>}
                    <div aria-hidden="true" className="load">
                      <i />
                    </div>
                  </div>
                </>
              )}

              {i === 2 && (
                <>
                  <span aria-hidden="true" className="rings">
                    <svg className="i" viewBox="0 0 24 24">
                      <path d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" />
                    </svg>
                  </span>
                  <h3>{cell.heading}</h3>
                  {cell.body && <p>{cell.body}</p>}
                </>
              )}

              {i === 3 && (
                <div className="stats">
                  {cell.stat && (
                    <div>
                      <div className="big">{cell.stat}</div>
                      {cell.body && <p>{cell.body}</p>}
                    </div>
                  )}
                  <div>
                    <h3 className="sr-only">{cell.heading}</h3>
                  </div>
                </div>
              )}

              {i === 4 && (
                <>
                  <span aria-hidden="true" className="chip">
                    <svg className="i" viewBox="0 0 24 24">
                      <rect height="20" rx="2" width="14" x="5" y="2" />
                      <path d="M12 18h.01" />
                    </svg>
                  </span>
                  <h3>{cell.heading}</h3>
                  {cell.body && <p>{cell.body}</p>}
                </>
              )}

              {i === 5 && (
                <>
                  {cell.image && (
                    <div className="render">
                      <Media resource={cell.image} />
                    </div>
                  )}
                  <div className="copy">
                    {cell.stat && <div className="big">{cell.stat}</div>}
                    <h3>{cell.heading}</h3>
                    {cell.body && <p>{cell.body}</p>}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
