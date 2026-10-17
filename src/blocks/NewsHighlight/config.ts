import type { Block } from 'payload'

export const NewsHighlight: Block = {
  slug: 'newsHighlight',
  interfaceName: 'NewsHighlightBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'From the blog',
      required: true,
    },
    {
      name: 'posts',
      type: 'relationship',
      admin: {
        description: 'First post is the large feature, the rest show as the side list (3 total works best).',
      },
      hasMany: true,
      maxRows: 3,
      relationTo: 'posts',
      required: true,
    },
  ],
  labels: {
    plural: 'News Highlights',
    singular: 'News Highlight',
  },
}
