import type { Block } from 'payload'

export const GamesRail: Block = {
  slug: 'gamesRail',
  interfaceName: 'GamesRailBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'In the spotlight',
      required: true,
    },
    {
      name: 'games',
      type: 'relationship',
      hasMany: true,
      relationTo: 'games',
      required: true,
    },
  ],
  labels: {
    plural: 'Games Rails',
    singular: 'Games Rail',
  },
}
