import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { revalidateGame, revalidateGameDelete } from './hooks/revalidateGame'

export const Games: CollectionConfig = {
  slug: 'games',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'featuredInHero', 'order', 'updatedAt'],
    useAsTitle: 'title',
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Short caption shown under the title on the games rail card.',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      admin: {
        description: 'Portrait artwork (3:4) used on the games rail.',
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'heroBackground',
      type: 'upload',
      admin: {
        description: 'Wide background art (16:9 or wider) used when this game is featured in the hero carousel.',
      },
      relationTo: 'media',
    },
    {
      name: 'kicker',
      type: 'text',
      admin: {
        description: 'Small label shown above the title in the hero carousel, e.g. "New release".',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short paragraph shown in the hero carousel for this game.',
      },
    },
    {
      name: 'featuredInHero',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show in hero carousel',
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Lower numbers appear first in the hero carousel and the games rail.',
        position: 'sidebar',
      },
      defaultValue: 0,
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateGame],
    afterDelete: [revalidateGameDelete],
  },
}
