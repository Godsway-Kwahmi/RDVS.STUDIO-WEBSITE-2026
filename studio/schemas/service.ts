import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service / Expertise',
  type: 'document',
  icon: () => '🔧',
  fields: [
    defineField({
      name: 'name',
      title: 'Service Name',
      type: 'string',
      description: 'e.g. "Architecture", "Interior Design", "Motion Design"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Filter Slug',
      type: 'string',
      description: 'Must match the data-filter value on work.html (e.g. "architecture-planning")',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {title: 'Architecture', value: 'architecture-planning'},
          {title: 'Interior Design', value: 'interior-design'},
          {title: 'Visual Effects (VFX) & CGI', value: 'vfx-cgi'},
          {title: 'Motion Design', value: 'motion-design'},
          {title: 'Graphic Design', value: 'graphic-design'},
          {title: 'Industrial & Furniture Design', value: 'industrial-design'},
          {title: 'Digital & Web Design', value: 'web-design'},
          {title: 'Design + Build', value: 'turnkey-build'},
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order on the Expertise page (lower = first)',
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
      title: 'name',
      order: 'order',
      media: 'coverImage',
    },
    prepare({title, order, media}) {
      return {
        title,
        subtitle: `#${order}`,
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
