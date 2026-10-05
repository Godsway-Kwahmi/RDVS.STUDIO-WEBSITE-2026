import {defineType, defineField, defineArrayMember} from 'sanity'
import TagIcon from '@sanity/icons/Tag'
import {MAIN_SERVICES, SERVICES, SUB_SERVICES} from '../taxonomy'

// Generated from work.html's filter bar, so the CMS cannot offer a service the site cannot filter on.
const SERVICE_OPTIONS = SERVICES.map((s) => ({title: s.label, value: s.value}))
const PARENT_OPTIONS = MAIN_SERVICES.map((s) => ({title: s.label, value: s.value}))
const LABELS: Record<string, string> = Object.fromEntries(SERVICES.map((s) => [s.value, s.label]))

// `tier` lives on the document itself, so read it off the document. Field callbacks and validation
// contexts have both carried the containing object under `parent` in some Sanity versions and not
// in others, and a silently-inert guard here is what let a bar-level service keep a parent.
const tierOf = (ctx: any): string | undefined => ctx?.document?.tier ?? ctx?.parent?.tier

export default defineType({
  name: 'service',
  title: 'Service / Expertise',
  type: 'document',
  icon: TagIcon,
  // One document per filter token: eight bar-level services and the sub-services nested under them.
  // expertise.html renders each Design sub-service as its own subrow in bar order, which is what
  // `tier` + `parent` + `order` describe.
  fields: [
    defineField({
      name: 'slug',
      title: 'Filter Token',
      type: 'string',
      description: 'Must equal the data-filter value on work.html and the ?service= value on project pages.',
      validation: (Rule) => Rule.required(),
      options: {list: SERVICE_OPTIONS},
    }),
    defineField({
      name: 'name',
      title: 'Service Name',
      type: 'string',
      description:
        'The visible label. It is checked against the filter bar by the generated taxonomy, so a ' +
        'rename here that has not happened on work.html is a lie the site will not keep up with.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tier',
      title: 'Bar Level',
      type: 'string',
      description: 'Bar-level services appear on the filter bar; sub-services appear nested under a parent.',
      options: {
        layout: 'radio',
        list: [
          {title: 'Bar-level service', value: 'main'},
          {title: 'Sub-service', value: 'sub'},
        ],
      },
      initialValue: 'sub',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Rolls Up To',
      type: 'string',
      description:
        'For a sub-service, the bar-level service a homepage slide names instead of it. ' +
        'Leave empty on a bar-level service.',
      hidden: ({document, parent}) => tierOf({document, parent}) === 'main',
      options: {list: PARENT_OPTIONS},
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          const tier = tierOf(context)
          if (tier === 'sub' && !value) return 'A sub-service needs the service it rolls up to'
          if (tier === 'main' && value) return 'A bar-level service has no parent'
          return true
        }),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Position within its group on the Expertise page and the filter bar (lower = first).',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
      description: 'Full description shown on the Expertise page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'capabilities',
      title: 'Key Capabilities',
      type: 'array',
      description: 'Bullet list of specific offerings under this service',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'coverImage',
      title: 'Service Cover Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text'}),
      ],
    }),
  ],
  preview: {
    select: {
      slug: 'slug',
      order: 'order',
      tier: 'tier',
      parent: 'parent',
      media: 'coverImage',
    },
    prepare({slug, order, tier, parent, media}) {
      // Read the label off the generated taxonomy rather than trusting a typed-in name, so a list
      // of services always shows what the filter bar actually says.
      const label = LABELS[slug] || slug
      const roll = tier === 'sub' && parent ? ` · rolls up to ${LABELS[parent] || parent}` : ''
      return {
        title: `${order}. ${label}`,
        subtitle: `${tier === 'main' ? 'Bar-level' : 'Sub-service'}${roll}`,
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

/** Token lists the Studio and the sync scripts share, so nobody re-types them. */
export const MAIN_SERVICE_TOKENS = MAIN_SERVICES.map((s) => s.value)
export const SUB_SERVICE_TOKENS = SUB_SERVICES.map((s) => s.value)
