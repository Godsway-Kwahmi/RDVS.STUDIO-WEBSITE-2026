import {defineType, defineField, defineArrayMember} from 'sanity'
import DocumentIcon from '@sanity/icons/Document'
import {
  PRODUCT_KINDS,
  PRODUCT_LINES,
  PRODUCT_TYPES,
  SERVICES,
  TYPOLOGIES,
  VISIBILITY,
} from '../taxonomy'

// The service options are generated from work.html's filter bar and js/main.js's roll-up table
// (see scripts/build_sanity_taxonomy.py). They used to be typed out here, which is how this schema
// ended up offering "Architecture" and "Visual Effects (VFX) & CGI" after both were renamed on the
// site, 8 of the 28 real tokens, and no `illustration` at all.
const SERVICE_OPTIONS = SERVICES.map((s) => ({title: s.label, value: s.value}))
const asList = (values: string[]) => values.map((v) => ({title: v, value: v}))

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      description:
        'The name as it appears on the project page <h1>, the work card, the archive row and the ' +
        'homepage slide. Those four must match exactly — scratch/_verify_backlog.py enforces it.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pageFile',
      title: 'Page File',
      type: 'string',
      description:
        'The HTML file this project is served from, e.g. "afg.html". This is the key the registry, ' +
        'the slideshow pools and data/project-status.json all use. It is NOT always the slug: ' +
        'the site renames display titles but keeps live URLs, so "Senseble" is still served from ' +
        '"home-automation-system-presentation.html".',
      validation: (Rule) =>
        Rule.required().regex(/^[a-z0-9-]+\.html$/, {
          name: 'html-file',
        }),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL key derived from the title. Kept for deep links; `pageFile` is canonical.',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured on Homepage',
      type: 'boolean',
      description:
        'Only biases the ordering of the hero query. The homepage deck is drawn at random per load ' +
        'and a slide may only use a frame the project page leads with.',
      initialValue: false,
    }),
    defineField({
      // Named `visibility`, not `status`: `specs.status` already carries the production
      // state (Completed / Under Construction / Concept / In Design) and the two must not
      // collide. This one field is the only switch for which surface a project appears on.
      name: 'visibility',
      title: 'Site Visibility',
      type: 'string',
      description:
        'Live = work page + archive page + homepage slideshow. ' +
        'Archived = archive page only. All live projects still show on the archive page.',
      options: {
        layout: 'radio',
        list: [
          {title: 'Live', value: VISIBILITY.LIVE},
          {title: 'Archived', value: VISIBILITY.ARCHIVED},
        ],
      },
      initialValue: VISIBILITY.LIVE,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'family',
      title: 'Listing Family',
      type: 'string',
      description:
        'Project = a commissioned job, listed on work.html and archive.html. Product = a piece of ' +
        'the in-house MIG line, listed on product.html instead. The two are not interchangeable: a ' +
        'product page carries no data-typology and no work-card tokens, and the homepage deck draws ' +
        'them from its own fifth pool. `pageFile` still decides which HTML file it hydrates.',
      options: {
        layout: 'radio',
        list: [
          {title: 'Project (work.html + archive.html)', value: 'project'},
          {title: 'Product (product.html, the MIG line)', value: 'product'},
        ],
      },
      initialValue: 'project',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Project Year',
      type: 'number',
      description:
        'Year the work was completed. The catalogue runs 2008 to 2024; date a project from its own ' +
        'paperwork or file metadata, not from when documentation was published.',
      validation: (Rule) => Rule.required().min(2000).max(2100),
    }),
    defineField({
      name: 'typology',
      title: 'Typology',
      type: 'string',
      description:
        'What the work IS (the left side of a page meta line and the work card sub-line). ' +
        'Generated from the values the work cards actually carry, so it only applies to a project: ' +
        'a product is described by Line / Type / Kind below instead.',
      hidden: ({document}) => document?.family === 'product',
      options: {list: TYPOLOGIES},
      validation: (Rule) =>
        Rule.custom((value, context: any) =>
          context?.document?.family === 'product' || value ? true : 'A project needs a typology',
        ),
    }),
    defineField({
      name: 'productLine',
      title: 'Product Line',
      type: 'string',
      description: 'The first segment of a product page meta line ("MIG").',
      hidden: ({document}) => document?.family !== 'product',
      options: {list: asList(PRODUCT_LINES)},
    }),
    defineField({
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      description: 'The middle segment ("Furniture", "Lights", "Accessories").',
      hidden: ({document}) => document?.family !== 'product',
      options: {list: asList(PRODUCT_TYPES)},
    }),
    defineField({
      name: 'productKind',
      title: 'Product Kind',
      type: 'string',
      description:
        'The last segment, which is what the page and its slide call the piece ("Desk", ' +
        '"Floating media unit"). Harvested from the product pages, so a kind nobody has published ' +
        'is not offered.',
      hidden: ({document}) => document?.family !== 'product',
      options: {list: asList(PRODUCT_KINDS)},
    }),
    defineField({
      name: 'primaryDiscipline',
      title: 'Primary Discipline',
      type: 'string',
      description:
        'The main service token this project falls under. Stored as a TOKEN (architecture-planning) ' +
        'because that is the filter identity; the page and the meta line print the bar LABEL ' +
        '(Architectural Design), which js/sanity-render.js maps through js/sanity-taxonomy.js.',
      options: {list: SERVICE_OPTIONS},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'disciplines',
      title: 'All Disciplines',
      type: 'array',
      description:
        'Every filter token this project should appear under. These are the `?service=` links in ' +
        'the page Services row and the card data-category, so the set must match the page exactly.',
      of: [defineArrayMember({type: 'string'})],
      options: {list: SERVICE_OPTIONS},
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'cardLabel',
      title: 'Card Label',
      type: 'string',
      description:
        'Fallback only. The work card and the slide caption both derive their service line from ' +
        '`disciplines`, rolled up to the eight bar-level services.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'One or two sentences for slides, cards and meta descriptions.',
    }),
    defineField({
      name: 'lead',
      title: 'Page Lead Paragraph',
      type: 'text',
      rows: 3,
      description: 'The opening line of the project page story, under the title.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero / Header Image',
      type: 'image',
      description:
        'Site convention: the header plate is also gallery item 1, baked 2400 px wide at JPEG q82 ' +
        'from the best master of that frame. It is one of the four frames a homepage slide may use.',
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
      description: 'Usually the hero plate. The card crops to its own box, so keep the subject centred.',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required()}),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Project Gallery',
      type: 'array',
      description:
        'Site convention: plates 2 onward are baked 1400 px wide at JPEG q82. The first three ' +
        'gallery items join the hero as the only frames a homepage slide may show, so lead with ' +
        'finished work rather than studies. The page Format row states the plate count and the ' +
        'widest raster plate, and the harness checks it against this array.',
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
      name: 'gallerySections',
      title: 'Gallery Sections',
      type: 'array',
      description:
        'Optional dividers that group the gallery on the page, in order. Titles are rendered as ' +
        '<h2 class="gallery-section-title">.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Section Title', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'subtitle', title: 'Section Subtitle', type: 'string'}),
            defineField({
              name: 'fromPlate',
              title: 'First Plate (1-based)',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'subtitle'},
          },
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
          name: 'team',
          title: 'Team',
          type: 'string',
          description: 'Named contributors, or "RDVS Team" when the work was not individually credited.',
        }),
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
      name: 'source',
      title: 'Documentation Source',
      type: 'string',
      description:
        'Where the facts on this page came from, so a later edit can re-check them: ' +
        '"studio paperwork", "Behance gallery <id>", "owner instruction", …',
      options: {
        list: [
          'Studio paperwork (invoice / moodboard / project files)',
          'Behance gallery',
          'Old Webflow site',
          'Instagram / Facebook post',
          'Owner instruction',
          'Mixed — note in a comment',
        ],
      },
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
      productKind: 'productKind',
      family: 'family',
      visibility: 'visibility',
      media: 'cardImage',
    },
    prepare({title, year, typology, productKind, family, visibility, media}) {
      // An archived project must look archived in every Studio list, not only in its own doc.
      const state = visibility === VISIBILITY.ARCHIVED ? ' · Archived' : ''
      const what = family === 'product' ? `${productKind || ''} · MIG` : typology || ''
      return {
        title,
        subtitle: `${year} · ${what}${state}`,
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
      title: 'Year (Oldest)',
      name: 'yearAsc',
      by: [{field: 'publishedAt', direction: 'asc'}],
    },
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
  ],
})
