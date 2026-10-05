import {defineType, defineField, defineArrayMember} from 'sanity'
import CogIcon from '@sanity/icons/Cog'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  // Singleton: structure.ts pins it to the document id "siteSettings", and sanity.config.ts turns
  // off create/delete for this type. (`__experimental_actions` on the schema was removed in
  // Sanity v4 — the config block is the supported way now.)
  fields: [
    defineField({
      name: 'studioName',
      title: 'Studio Name',
      type: 'string',
      description: 'Displayed in the browser tab and site header',
      initialValue: 'RDVS Studios',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Studio Tagline',
      type: 'string',
      description: 'Short tagline shown on the homepage',
    }),
    defineField({
      name: 'description',
      title: 'Studio Description',
      type: 'text',
      rows: 3,
      description: 'Used in the homepage subtitle and meta descriptions',
    }),
    defineField({
      name: 'foundedYear',
      title: 'Founded Year',
      type: 'number',
      description:
        'The year about.html and the archive range are worded from ("designing and making things ' +
        'since …", "Selected work (2008–2024)"). Change it here and those sentences have to be ' +
        're-checked — they are prose, not derived.',
      initialValue: 2008,
      validation: (Rule) => Rule.required().min(1990).max(2100),
    }),
    defineField({
      name: 'archiveStartYear',
      title: 'Archive Range — Start',
      type: 'number',
      initialValue: 2008,
    }),
    defineField({
      name: 'archiveEndYear',
      title: 'Archive Range — End',
      type: 'number',
      description:
        'The latest year with work in archive.html. archive.html currently claims 2024; if this ' +
        'changes, the page title, its intro sentence and the footer copyright all need to agree.',
      initialValue: 2024,
    }),
    defineField({
      name: 'email',
      title: 'Contact Email',
      type: 'string',
      initialValue: 'info@rdvsstudiosgh.com',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Studio Address',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      // Defaults are the channels that resolve today. The site footer still links
      // youtube.com/@rdvstudiosgh, which 404s — the live channel is @rdvs.studio. Fixing the
      // footer on all 142 pages is an open, unapproved item; do not assume the CMS fixed it.
      fields: [
        defineField({name: 'instagram', title: 'Instagram URL', type: 'url', initialValue: 'https://www.instagram.com/rdvs.studio/'}),
        defineField({name: 'twitter', title: 'X / Twitter URL', type: 'url', initialValue: 'https://x.com/RDVS_DESIGN'}),
        defineField({name: 'facebook', title: 'Facebook URL', type: 'url', initialValue: 'https://www.facebook.com/RDVS.DESIGN/'}),
        defineField({name: 'youtube', title: 'YouTube URL', type: 'url', initialValue: 'https://www.youtube.com/@rdvs.studio'}),
        defineField({name: 'behance', title: 'Behance URL', type: 'url', initialValue: 'https://www.behance.net/rdvs'}),
        defineField({name: 'linkedin', title: 'LinkedIn URL', type: 'url'}),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Default Open Graph Image',
      type: 'image',
      description: 'Fallback social sharing image when no page-specific image is set',
      options: {hotspot: true},
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'string'}),
          ],
          preview: {
            select: {title: 'label', subtitle: 'url'},
          },
        }),
      ],
    }),
    defineField({
      name: 'copyrightYear',
      title: 'Copyright Year',
      type: 'number',
      description: 'Blank it to let the footer use the current year, as it does today.',
      initialValue: new Date().getFullYear(),
    }),
  ],
  preview: {
    select: {title: 'studioName'},
    prepare({title}) {
      return {title: title || 'Site Settings'}
    },
  },
})
