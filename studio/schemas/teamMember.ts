import {defineType, defineField, defineArrayMember} from 'sanity'
import UserIcon from '@sanity/icons/User'
import {SERVICES} from '../taxonomy'

// Same generated token list the projects use, so a person is tagged with services the site can
// actually name. This used to be a typed-out list of free-text labels ("Architecture",
// "VFX & CGI", "Masterplanning") that matched no filter token anywhere on the site.
const SERVICE_OPTIONS = SERVICES.map((s) => ({title: s.label, value: s.value}))

export default defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
    }),
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      description: 'e.g. "Principal Architect", "Senior Interior Designer"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first on the About page',
    }),
    defineField({
      name: 'active',
      title: 'Show on About Page',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required()}),
      ],
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'disciplines',
      title: 'Disciplines',
      type: 'array',
      description: 'Service tokens this person works across',
      of: [defineArrayMember({type: 'string'})],
      options: {list: SERVICE_OPTIONS},
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      role: 'role',
      order: 'order',
      active: 'active',
      media: 'photo',
    },
    prepare({title, role, order, active, media}) {
      return {
        title,
        subtitle: `${order ? '#' + order + ' · ' : ''}${role}${active === false ? ' · hidden' : ''}`,
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
