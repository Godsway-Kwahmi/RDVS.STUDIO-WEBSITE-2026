import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'slide',
  title: 'Homepage Slide',
  type: 'document',
  icon: () => '🖼️',
  fields: [
    defineField({
      name: 'title',
      title: 'Slide Title',
      type: 'string',
      description: 'Used as the image alt text and aria-label',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first. Slides are also randomly shuffled in the hero.',
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
      title: 'Slide Image',
      type: 'image',
      description: 'Must be landscape with width ≥ 1600px and aspect ratio ≥ 1.45 for full-bleed display',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required()}),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'linkedProject',
      title: 'Linked Project',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'Optional: links the slide to a project page',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
      active: 'active',
      media: 'image',
    },
    prepare({title, order, active, media}) {
      return {
        title,
        subtitle: `#${order} · ${active ? 'Active' : '⛔ Inactive'}`,
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
