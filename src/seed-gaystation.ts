/**
 * One-off content seed for the GayStation homepage: uploads the art from
 * concept-static/images, creates the Games/Posts/Categories it needs, wires
 * up the Header/Footer nav, and assembles the `home` Page (hero + blocks).
 *
 * Run with: npx tsx src/seed-gaystation.ts
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { getPayload } from 'payload'

dotenv.config()

const dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.resolve(dirname, '../concept-static/images')

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
}

function readFile(name: string) {
  const filePath = path.join(imagesDir, name)
  const buffer = fs.readFileSync(filePath)
  const ext = path.extname(name)
  return {
    name,
    data: buffer,
    mimetype: MIME[ext] || 'application/octet-stream',
    size: buffer.length,
  }
}

function paragraph(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

async function main() {
  const { default: config } = await import('./payload.config')
  const payload = await getPayload({ config })

  payload.logger.info('— Uploading media...')
  const mediaCache = new Map<string, number>()
  async function media(filename: string, alt: string) {
    if (mediaCache.has(filename)) return mediaCache.get(filename)!
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: readFile(filename),
    })
    mediaCache.set(filename, doc.id)
    return doc.id
  }

  const [poster, bgGtaWide, bgFc27, bgFc27Wide, bgSpider, bgSpiderWide, bgHitman, padImg, renderImg, newsStreamer, newsTv, newsImg] =
    await Promise.all([
      media('poster.jpg', 'Generic key art'),
      media('bg-gta-wide.jpg', 'Grand Theft Auto VI key art, widescreen'),
      media('bg-fc27.jpg', 'EA Sports FC 27 key art'),
      media('bg-fc27-wide.jpg', 'EA Sports FC 27 key art, widescreen'),
      media('bg-spider.jpg', 'Spider-Man Remastered parody cover'),
      media('bg-spider-wide.jpg', 'Spider-Man Remastered parody cover, widescreen'),
      media('bg-hitman.jpg', 'Hitman 2 key art'),
      media('pad-img.webp', 'Game controller render'),
      media('render-img.webp', 'Console render'),
      media('news-streamer.jpg', 'A streamer at his desk'),
      media('news-tv.jpg', 'A TV showing the GayStation boot screen'),
      media('newsimg.jpg', 'Gaming room with neon lights'),
    ])

  payload.logger.info('— Creating categories...')
  async function category(title: string) {
    const existing = await payload.find({ collection: 'categories', where: { title: { equals: title } } })
    if (existing.docs[0]) return existing.docs[0].id
    const doc = await payload.create({ collection: 'categories', data: { title, slug: title.toLowerCase() } })
    return doc.id
  }
  const [catEvents, catUpdates, catInterview] = await Promise.all([
    category('Events'),
    category('Updates'),
    category('Interview'),
  ])

  payload.logger.info('— Creating games...')
  async function game(data: {
    title: string
    slug: string
    tagline: string
    poster: number
    heroBackground?: number
    kicker?: string
    description?: string
    featuredInHero?: boolean
    order: number
  }) {
    const existing = await payload.find({ collection: 'games', where: { slug: { equals: data.slug } } })
    if (existing.docs[0]) return existing.docs[0].id
    const doc = await payload.create({ collection: 'games', data, context: { disableRevalidate: true } })
    return doc.id
  }

  const gta = await game({
    title: 'Grand Theft Auto VI',
    slug: 'grand-theft-auto-vi',
    tagline: 'Action, open world',
    poster,
    heroBackground: bgGtaWide,
    kicker: 'Coming soon — Open world',
    description: 'Neon nights, fast boats and a cast nobody asked for.',
    featuredInHero: true,
    order: 1,
  })
  const fc27 = await game({
    title: 'EA Sports FC 27',
    slug: 'ea-sports-fc-27',
    tagline: 'Sports, football',
    poster: bgFc27,
    heroBackground: bgFc27Wide,
    kicker: 'Pre-order — Ultimate Edition',
    description: 'Floodlights, a packed stadium and a lineup you will not find in any real squad.',
    featuredInHero: true,
    order: 2,
  })
  const spiderman = await game({
    title: 'Spider-Man Remastered',
    slug: 'spider-man-remastered',
    tagline: 'Action, superhero',
    poster: bgSpider,
    heroBackground: bgSpiderWide,
    kicker: 'Remastered — Out now',
    description: 'Same city, sharper suit, and a hero who did not see this coming.',
    featuredInHero: true,
    order: 3,
  })
  const hitman = await game({
    title: 'Hitman 2',
    slug: 'hitman-2',
    tagline: 'Stealth, action',
    poster: bgHitman,
    order: 4,
  })
  const tidebreaker = await game({
    title: 'Tidebreaker',
    slug: 'tidebreaker',
    tagline: 'Role-playing',
    poster,
    order: 5,
  })
  const finalWhistle = await game({
    title: 'Final Whistle',
    slug: 'final-whistle',
    tagline: 'Sports',
    poster,
    order: 6,
  })

  payload.logger.info('— Creating posts...')
  async function post(data: { title: string; slug: string; heroImage: number; category: number }) {
    const existing = await payload.find({ collection: 'posts', where: { slug: { equals: data.slug } } })
    if (existing.docs[0]) return existing.docs[0].id
    const doc = await payload.create({
      collection: 'posts',
      data: {
        title: data.title,
        slug: data.slug,
        heroImage: data.heroImage,
        categories: [data.category],
        content: paragraph(data.title),
        _status: 'published',
      },
      context: { disableRevalidate: true },
    })
    return doc.id
  }

  const newsMain = await post({
    title: 'Everything from the fall showcase in twenty minutes',
    slug: 'fall-showcase-recap',
    heroImage: newsStreamer,
    category: catEvents,
  })
  const newsUpdate = await post({
    title: 'New system update brings faster search and more flexible profiles',
    slug: 'system-update-search-profiles',
    heroImage: newsTv,
    category: catUpdates,
  })
  const newsInterview = await post({
    title: 'How a small studio from Lviv shipped its first console game',
    slug: 'lviv-studio-first-console-game',
    heroImage: newsImg,
    category: catInterview,
  })

  payload.logger.info('— Setting Header/Footer nav...')
  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { link: { type: 'custom', url: '#games', label: 'Games' } },
        { link: { type: 'custom', url: '#console', label: 'Console' } },
        { link: { type: 'custom', url: '#plus', label: 'Subscription' } },
        { link: { type: 'custom', url: '#news', label: 'News' } },
      ],
    },
    context: { disableRevalidate: true },
  })
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      navItems: [
        { link: { type: 'custom', url: '#games', label: 'New releases' } },
        { link: { type: 'custom', url: '#plus', label: 'Subscription' } },
        { link: { type: 'custom', url: '#games', label: 'Exclusives' } },
        { link: { type: 'custom', url: '#plus', label: 'Store' } },
        { link: { type: 'custom', url: '#', label: 'Help' } },
        { link: { type: 'custom', url: '#', label: 'Account security' } },
      ],
    },
    context: { disableRevalidate: true },
  })

  payload.logger.info('— Assembling home page...')
  const homeData = {
    title: 'Home',
    slug: 'home',
    _status: 'published' as const,
    hero: {
      type: 'gamingCarousel' as const,
      games: [gta, fc27, spiderman],
    },
    layout: [
      {
        blockType: 'gamesRail' as const,
        heading: 'In the spotlight',
        games: [gta, hitman, fc27, spiderman, tidebreaker, finalWhistle],
      },
      {
        blockType: 'bentoFeatures' as const,
        heading: 'Built for play',
        lead: 'Fast enough that you forget the hardware is there.',
        cells: [
          {
            heading: 'Feel every impact',
            body: 'Tension in the triggers, texture in your palms. The controller turns what happens on screen into something you can feel.',
            tags: [{ label: 'Haptic feedback' }, { label: 'Adaptive triggers' }, { label: 'Built-in mic' }],
            image: padImg,
          },
          {
            heading: 'Loading screens, almost gone',
            body: 'A custom SSD streams worlds in as fast as you can move through them.',
            stat: '5.5 GB/s',
          },
          {
            heading: '3D audio',
            body: 'Hear exactly where every footstep comes from.',
          },
          {
            heading: 'Sharp detail, high frame rate',
            body: 'Up to 120fps on supported displays.',
            stat: '4K',
          },
          {
            heading: 'Remote play',
            body: 'Keep going on your phone when the TV is taken.',
          },
          {
            heading: 'Slimmer, quieter, more room',
            body: 'Space for your whole library, in a body that fits any shelf.',
            stat: '1 TB',
            image: renderImg,
          },
        ],
      },
      {
        blockType: 'subscription' as const,
        heading: 'Hundreds of games, one subscription',
        lead: 'Pick a plan, switch any time. Your saves come with you.',
      },
      {
        blockType: 'newsHighlight' as const,
        heading: 'From the blog',
        posts: [newsMain, newsUpdate, newsInterview],
      },
      {
        blockType: 'finale' as const,
        topWord: 'Press',
        bottomWord: 'Start',
        lead: 'Your next story is one button away. Pick a game and play tonight.',
        link: { type: 'custom' as const, url: '#games', label: 'Explore games' },
        padImage: padImg,
      },
    ],
    meta: {
      title: 'Play more',
      description: 'Hundreds of games, one subscription. A parody fan concept for a portfolio.',
    },
  }

  const existingHome = await payload.find({ collection: 'pages', where: { slug: { equals: 'home' } } })
  if (existingHome.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: existingHome.docs[0].id,
      data: homeData,
      context: { disableRevalidate: true },
    })
  } else {
    await payload.create({ collection: 'pages', data: homeData, context: { disableRevalidate: true } })
  }

  payload.logger.info('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
