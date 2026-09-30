import {defineType, defineField, defineArrayMember} from 'sanity'

// Discipline options matching the work.html filter system
const DISCIPLINES = [
  {title: 'Architecture', value: 'architecture-planning'},
  {title: 'Interior Design', value: 'interior-design'},
  {title: 'Visual Effects (VFX) & CGI', value: 'vfx-cgi'},
  {title: 'Motion Design', value: 'motion-design'},
  {title: 'Graphic Design', value: 'graphic-design'},
  {title: 'Industrial & Furniture Design', value: 'industrial-design'},
  {title: 'Digital & Web Design', value: 'web-design'},
  {title: 'Design + Build', value: 'turnkey-build'},
]

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: () => '🏛️',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug / Page URL',
      type: 'slug',
      description: 'Used for the project page URL (e.g. "afg" → afg.html)',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Project Year',
      type: 'number',
      description: 'Year the project was completed or published',
      validation: (Rule) => Rule.required().min(2000).max(2100),
    }),
    defineField({
      name: 'typology',
      title: 'Typology',
      type: 'string',
      options: {
        list: [
          'Residential',
          'Commercial',
          'Hospitality',
          'Institutional',
          'Mixed-Use',
          'Workplace',
          'Technology',
          'Cultural',
          'Educational',
          'Broadcast',
          'Identity',
          'Digital',
        ],
      },
    }),
    defineField({
      name: 'primaryDiscipline',
      title: 'Primary Discipline',
      type: 'string',
      description: 'The main service category this project falls under',
      options: {list: DISCIPLINES},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'disciplines',
      title: 'All Disciplines',
      type: 'array',
      description: 'All service categories this project appears under when filtering',
      of: [defineArrayMember({type: 'string'})],
      options: {list: DISCIPLINES},
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'cardLabel',
      title: 'Card Label',
      type: 'string',
      description: 'Short label shown on the work grid card (e.g. "Architecture & 3D VFX")',
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'Brief description shown in slideshows and meta descriptions',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero / Header Image',
      type: 'image',
      description: 'Wide landscape image (min 1600px wide) used as the page header',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required()}),
        defineField({name: 'caption', type: 'string', title: 'Caption'}),
      ],
    }),
    defineField({
      name: 'cardImage',
      title: 'Work Grid Card Image',
      type: 'image',
      description: 'Landscape image used on the work.html grid (can be same as hero)',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required()}),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Project Gallery',
      type: 'array',
      of: [
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
      name: 'body',
      title: 'Project Description',
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
    // Project specs (shown in the sidebar on project pages)
    defineField({
      name: 'specs',
      title: 'Project Specifications',
      type: 'object',
      fields: [
        defineField({name: 'client', title: 'Client', type: 'string'}),
        defineField({name: 'scope', title: 'Scope', type: 'string'}),
        defineField({name: 'area', title: 'Area / Scale', type: 'string', description: 'e.g. "3,400 sq.m"'}),
        defineField({name: 'location', title: 'Location', type: 'string'}),
        defineField({
          name: 'status',
          title: 'Status',
          type: 'string',
          options: {
            list: ['Completed', 'Under Construction', 'Concept', 'In Design'],
          },
        }),
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Overrides page <title> if set',
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
      year: 'publishedAt',
      typology: 'typology',
      media: 'cardImage',
    },
    prepare({title, year, typology, media}) {
      return {
        title,
        subtitle: `${year} · ${typology || ''}`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Year (Newest)',
      name: 'yearDesc',
      by: [{field: 'publishedAt', direction: 'desc'}],
    },
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})
