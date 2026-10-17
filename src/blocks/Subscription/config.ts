import type { Block } from 'payload'

export const Subscription: Block = {
  slug: 'subscription',
  interfaceName: 'SubscriptionBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Hundreds of games, one subscription',
      required: true,
    },
    {
      name: 'lead',
      type: 'textarea',
    },
  ],
  labels: {
    plural: 'Subscription Pitches',
    singular: 'Subscription Pitch',
  },
}
