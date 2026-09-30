import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('RDVS Studio CMS')
    .items([
      // Site Settings (singleton)
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .icon(() => '⚙️')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.divider(),

      // Projects
      S.listItem()
        .title('Projects')
        .icon(() => '🏛️')
        .schemaType('project')
        .child(S.documentTypeList('project').title('All Projects')),

      // Homepage Slides
      S.listItem()
        .title('Homepage Slides')
        .icon(() => '🖼️')
        .schemaType('slide')
        .child(S.documentTypeList('slide').title('Homepage Slides')),

      S.divider(),

      // News / Journal
      S.listItem()
        .title('News & Journal')
        .icon(() => '📰')
        .schemaType('post')
        .child(S.documentTypeList('post').title('All Posts')),

      // Services / Expertise
      S.listItem()
        .title('Services')
        .icon(() => '🔧')
        .schemaType('service')
        .child(S.documentTypeList('service').title('All Services')),

      S.divider(),

      // Team
      S.listItem()
        .title('Team')
        .icon(() => '👤')
        .schemaType('teamMember')
        .child(S.documentTypeList('teamMember').title('Team Members')),
    ])
