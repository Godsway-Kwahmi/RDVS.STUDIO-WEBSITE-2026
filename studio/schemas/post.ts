import {defineType, defineField, defineArrayMember} from 'sanity'
import DocumentTextIcon from '@sanity/icons/DocumentText'
import {VISIBILITY} from '../taxonomy'

export default defineType({
  // The runtime used to query `_type == "article"`, which no schema defined, so news.html could
  // never be fed from the CMS. The type name is `post`; js/sanity-client.js now asks for `post`.
  name: 'post',
  title: 'News & Journal Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description:
        'News items lead the homepage deck, and a slide\'s title must match the headline this ' +
        'article is published under on news.html.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'visibility',
      title: 'Site Visibility',
      type: 'string',
      description: 'Draft items stay out of the news listing and the homepage deck.',
      options: {
        layout: 'radio',
        list: [
          {title: 'Published', value: VISIBILITY.LIVE},
          {title: 'Draft', value: VISIBILITY.ARCHIVED},
        ],
      },
      initialValue: VISIBILITY.LIVE,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'Project Spotlight',
          'Design Insight',
          'Studio News',
          'Process & Method',
          'Awards & Recognition',
          'Collaboration',
        ],
      },
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required()}),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short description shown on the news listing page',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({type: 'block'}),
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', type: 'string', title: 'Alt text'}),
            defineField({name: 'caption', type: 'string', title: 'Caption'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'project'}]})],
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      publishedAt: 'publishedAt',
      category: 'category',
      visibility: 'visibility',
      media: 'coverImage',
    },
    prepare({title, publishedAt, category, visibility, media}) {
      const date = publishedAt ? new Date(publishedAt).getFullYear() : ''
      const state = visibility === VISIBILITY.ARCHIVED ? ' · Draft' : ''
      return {
        title,
        subtitle: `${date} · ${category || 'Uncategorised'}${state}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published (Newest)',
      name: 'publishedAtDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
  ],
})
