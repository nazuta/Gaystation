import type { Block } from 'payload'

export const BentoFeatures: Block = {
  slug: 'bentoFeatures',
  interfaceName: 'BentoFeaturesBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Built for play',
      required: true,
    },
    {
      name: 'lead',
      type: 'textarea',
    },
    {
      name: 'cells',
      type: 'array',
      admin: {
        description:
          'Exactly 6 cells, filled into the bento grid in order: controller, storage, audio, resolution, remote play, console.',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          required: true,
        },
        {
          name: 'body',
          type: 'textarea',
        },
        {
          name: 'stat',
          type: 'text',
          admin: {
            description: 'Big display number/label for this cell, e.g. "1 TB" or "4K".',
          },
        },
        {
          name: 'tags',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
      maxRows: 6,
      minRows: 6,
      required: true,
    },
  ],
  labels: {
    plural: 'Bento Features',
    singular: 'Bento Features',
  },
}
