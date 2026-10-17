import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { BentoFeaturesBlock } from '@/blocks/BentoFeatures/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FinaleBlock } from '@/blocks/Finale/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { GamesRailBlock } from '@/blocks/GamesRail/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { NewsHighlightBlock } from '@/blocks/NewsHighlight/Component'
import { SubscriptionBlock } from '@/blocks/Subscription/Component'

const blockComponents = {
  archive: ArchiveBlock,
  bentoFeatures: BentoFeaturesBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  finale: FinaleBlock,
  formBlock: FormBlock,
  gamesRail: GamesRailBlock,
  mediaBlock: MediaBlock,
  newsHighlight: NewsHighlightBlock,
  subscription: SubscriptionBlock,
}

// These GayStation sections are full-bleed and manage their own vertical rhythm
// via the `.sec` padding ported from concept-static — they shouldn't get the
// generic `my-16` spacer the stock template blocks rely on.
const fullBleedBlockTypes = new Set([
  'bentoFeatures',
  'finale',
  'gamesRail',
  'newsHighlight',
  'subscription',
])

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              if (fullBleedBlockTypes.has(blockType)) {
                // @ts-expect-error there may be some mismatch between the expected types here
                return <Block key={index} {...block} />
              }

              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
