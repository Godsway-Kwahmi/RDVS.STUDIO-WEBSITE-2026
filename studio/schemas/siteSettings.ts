import {defineType, defineField, defineArrayMember} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: () => '⚙️',
  // Singleton — only one document of this type
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'studioName',
      title: 'Studio Name',
      type: 'string',
      description: 'Displayed in the browser tab and site header',
      initialValue: 'RDVS Studio',
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
      name: 'email',
      title: 'Contact Email',
      type: 'string',
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
      fields: [
        defineField({name: 'instagram', title: 'Instagram URL', type: 'url'}),
        defineField({name: 'twitter', title: 'X / Twitter URL', type: 'url'}),
        defineField({name: 'facebook', title: 'Facebook URL', type: 'url'}),
        defineField({name: 'youtube', title: 'YouTube URL', type: 'url'}),
        defineField({name: 'linkedin', title: 'LinkedIn URL', type: 'url'}),
        defineField({name: 'behance', title: 'Behance URL', type: 'url'}),
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
