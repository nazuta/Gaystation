import Link from 'next/link'
import React from 'react'

import type { NewsHighlightBlock as NewsHighlightBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'

export const NewsHighlightBlock: React.FC<NewsHighlightBlockProps> = ({ heading, posts }) => {
  const items = (posts || []).filter((post) => typeof post === 'object')
  if (!items.length) return null

  const [main, ...side] = items

  const categoryLabel = (post: (typeof items)[number]) => {
    const category = post.categories?.find((c) => typeof c === 'object')
    return typeof category === 'object' ? category?.title : undefined
  }

  return (
    <section className="sec" id="news">
      <div className="wrap">
        <h2 className="rv font-heading text-[clamp(30px,3.8vw,52px)] leading-[1.08] font-bold tracking-[-.035em]">
          {heading}
        </h2>

        <div className="news">
          <Link className="news-main rv group block" href={`/posts/${main.slug}`}>
            <div className="ph">
              {main.heroImage && typeof main.heroImage === 'object' && (
                <Media fill imgClassName="object-cover" resource={main.heroImage} />
              )}
            </div>
            {categoryLabel(main) && <p className="meta">{categoryLabel(main)}</p>}
            <h3 className="transition-colors group-hover:text-primary-hi">{main.title}</h3>
          </Link>

          {!!side.length && (
            <div className="news-side">
              {side.map((post, i) => (
                <Link
                  className="news-item group rv"
                  href={`/posts/${post.slug}`}
                  key={post.id}
                  style={{ '--i': i + 1 } as React.CSSProperties}
                >
                  <div className="ph">
                    {post.heroImage && typeof post.heroImage === 'object' && (
                      <Media fill imgClassName="object-cover" resource={post.heroImage} />
                    )}
                  </div>
                  <div>
                    <h4 className="transition-colors group-hover:text-primary-hi">{post.title}</h4>
                    {categoryLabel(post) && <p className="meta">{categoryLabel(post)}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
