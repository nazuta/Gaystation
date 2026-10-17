import type { Block } from 'payload'

import { link } from '../../fields/link'

export const Finale: Block = {
  slug: 'finale',
  interfaceName: 'FinaleBlock',
  fields: [
    {
      name: 'topWord',
      type: 'text',
      defaultValue: 'Press',
      required: true,
    },
    {
      name: 'bottomWord',
      type: 'text',
      defaultValue: 'Start',
      required: true,
    },
    {
      name: 'lead',
      type: 'textarea',
    },
    link({
      appearances: false,
    }),
    {
      name: 'padImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  labels: {
    plural: 'Finales',
    singular: 'Finale',
  },
}
