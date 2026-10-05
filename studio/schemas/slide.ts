import {defineType, defineField} from 'sanity'
import ImagesIcon from '@sanity/icons/Images'
import {SLIDE_POOLS} from '../taxonomy'

// The pool options are generated from js/main.js's own `serviceKeys` + `servicePools[*].name`, so
// the Studio cannot offer a pool the runtime does not draw. Without this field a slide document
// could not express which of the deck's five equal-share quotas it competes for, and the CMS could
// not reproduce the paint the static page shows.
const POOL_OPTIONS = SLIDE_POOLS.map((p) => ({title: p.label, value: p.value}))

export default defineType({
  name: 'slide',
  title: 'Homepage Slide',
  type: 'document',
  icon: ImagesIcon,
  // The homepage paints twenty slides in markup and then re-draws them at random per load, so this
  // type curates the pool the draw picks from. Captions are NOT stored here: at runtime
  // fetchProjectPageInfo() overwrites a slide's title, service and year with what the linked
  // project page itself states, so storing them would only create a second, staler truth.
  fields: [
    defineField({
      name: 'title',
      title: 'Slide Title',
      type: 'string',
      description:
        'Used as the image alt text and aria-label. It must equal the linked project page\'s ' +
        '<h1 class="project-page-title"> — the harness fails a deck whose slide names a project ' +
        'differently from its own page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pool',
      title: 'Homepage Pool',
      type: 'string',
      description:
        'Which of the deck\'s equal-share pools this slide draws from. The budget is split across ' +
        'the five, so a slide with no pool cannot be placed.',
      options: {layout: 'radio', list: POOL_OPTIONS},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first. The runtime draw also shuffles, so this only seeds the paint.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      description: 'Inactive slides are excluded from the homepage rotation',
      initialValue: true,
    }),
    defineField({
      name: 'image',
      title: 'Slide Image (desktop)',
      type: 'image',
      description:
        'The frame the linked project LEADS with — its hero or one of its first three gallery ' +
        'plates — never something deeper in the gallery, and always the widest real file of that ' +
        'frame rather than a thumbnail or a compressed sibling.',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required()}),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'imageMobile',
      title: 'Slide Image (mobile)',
      type: 'image',
      description:
        'Optional portrait crop for the ≤768px <source>. Leave empty to reuse the desktop frame — ' +
        'a narrower crop is only an upgrade if it is the same frame, not a different one.',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text'}),
      ],
    }),
    defineField({
      name: 'video',
      title: 'Slide Film',
      type: 'file',
      options: {accept: 'video/mp4'},
      description: 'A film plays in place of the image; the image still carries the poster and alt text.',
    }),
    defineField({
      name: 'linkedProject',
      title: 'Linked Project',
      type: 'reference',
      to: [{type: 'project'}],
      description:
        'Required in practice: the slide links to this project\'s page and its caption is read ' +
        'from that page at runtime. A product piece links to a project document whose Listing ' +
        'Family is Product.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
      active: 'active',
      pool: 'pool',
      media: 'image',
    },
    prepare({title, order, active, pool, media}) {
      const label = (SLIDE_POOLS.find((p) => p.value === pool) || {label: pool}).label
      return {
        title,
        subtitle: `#${order} · ${label || 'unpooled'} · ${active ? 'Active' : 'Inactive'}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
})
