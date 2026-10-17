import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Game } from '../../../payload-types'

// Games are rendered on the homepage hero carousel and the games rail,
// so any change just needs to bust the home page cache.
export const revalidateGame: CollectionAfterChangeHook<Game> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating home page after game change: ${doc.title}`)
    // Throws when called outside a Next.js request context (e.g. a standalone seed script) — safe to ignore there.
    try {
      revalidatePath('/')
    } catch {
      // no-op
    }
  }

  return doc
}

export const revalidateGameDelete: CollectionAfterDeleteHook<Game> = ({
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    try {
      revalidatePath('/')
    } catch {
      // no-op
    }
  }
}
