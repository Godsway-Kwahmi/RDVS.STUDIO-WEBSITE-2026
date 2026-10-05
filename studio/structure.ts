import {StructureBuilder} from 'sanity/structure'
// @sanity/icons v5 ships each icon as its own module (`@sanity/icons/Document`, default-exporting
// `DocumentIcon`) and its ROOT bundle exports only `{Icon, icons}` -- so importing `{DocumentIcon}`
// from the package root typechecks against index.d.ts and then fails the bundle with MISSING_EXPORT,
// which is what stopped `sanity build` from ever completing here. Emoji-as-component
// (`icon: () => '🏛️'`) is not an icon component either; these are real components.
import CogIcon from '@sanity/icons/Cog'
import DocumentIcon from '@sanity/icons/Document'
import DocumentTextIcon from '@sanity/icons/DocumentText'
import ImagesIcon from '@sanity/icons/Images'
import TagIcon from '@sanity/icons/Tag'
import UserIcon from '@sanity/icons/User'
import {VISIBILITY} from './taxonomy'

// Emoji-as-component (`icon: () => '🏛️'`) is not an icon component; Studio renders a pane header
// where one is expected. These are real @sanity/icons components, which sanity ships alongside.
//
// The visibility values are interpolated from the generated taxonomy rather than typed into each
// GROQ string, so `live`/`archived` are defined in exactly one place (studio/taxonomy.ts, which
// scripts/build_sanity_taxonomy.py regenerates from the site).
const LIVE = `visibility == "${VISIBILITY.LIVE}" || !defined(visibility)`
const ARCHIVED = `visibility == "${VISIBILITY.ARCHIVED}"`

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('RDVS Studio CMS')
    .items([
      // Site Settings (singleton — sanity.config.ts disables create/delete for the type)
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .icon(CogIcon)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.divider(),

      // Projects — split by Site Visibility so the Live/Archived switch is one click
      S.listItem()
        .title('Projects')
        .icon(DocumentIcon)
        .schemaType('project')
        .child(
          S.list()
            .title('Projects')
            .items([
              S.listItem()
                .title('Commissioned work')
                .icon(DocumentIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Commissioned work')
                    .filter(`(_type == "project") && family != "product"`)                ),
              // The in-house MIG pieces are listed on product.html, never on work.html, so they get
              // their own list rather than being mixed into the commissioned set.
              S.listItem()
                .title('Product line (MIG)')
                .icon(DocumentIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Product line (MIG)')
                    .filter('(_type == "project") && family == "product"')                ),
              S.divider(),
              S.listItem()
                .title('Live (on work.html)')
                .icon(DocumentIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Live projects')
                    .filter(`(_type == "project") && (${LIVE})`)                ),
              S.listItem()
                .title('Archived (archive.html only)')
                .icon(DocumentIcon)
                .child(
                  S.documentTypeList('project')
                    .title('Archived projects')
                    .filter(`(_type == "project") && ${ARCHIVED}`)                ),
              S.divider(),
              S.listItem()
                .title('All Projects')
                .child(S.documentTypeList('project').title('All Projects')),
            ]),
        ),

      // Homepage Slides
      S.listItem()
        .title('Homepage Slides')
        .icon(ImagesIcon)
        .schemaType('slide')
        .child(S.documentTypeList('slide').title('Homepage Slides')),

      S.divider(),

      // News / Journal
      S.listItem()
        .title('News & Journal')
        .icon(DocumentTextIcon)
        .schemaType('post')
        .child(
          S.list()
            .title('News & Journal')
            .items([
              S.listItem()
                .title('Published')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('post')
                    .title('Published')
                    .filter(`(_type == "post") && (${LIVE})`)
                ),
              S.listItem()
                .title('Drafts')
                .icon(DocumentTextIcon)
                .child(
                  S.documentTypeList('post')
                    .title('Drafts')
                    .filter(`(_type == "post") && ${ARCHIVED}`)
                ),
              S.divider(),
              S.listItem()
                .title('All Posts')
                .child(S.documentTypeList('post').title('All Posts')),
            ]),
        ),

      // Services / Expertise — split by bar level so the two-tier filter bar is visible in the list
      S.listItem()
        .title('Services')
        .icon(TagIcon)
        .schemaType('service')
        .child(
          S.list()
            .title('Services')
            .items([
              S.listItem()
                .title('Bar-level services')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('service')
                    .title('Bar-level services')
                    .filter('_type == "service" && tier == "main"')
                ),
              S.listItem()
                .title('Sub-services')
                .icon(TagIcon)
                .child(
                  S.documentTypeList('service')
                    .title('Sub-services')
                    .filter('_type == "service" && tier == "sub"')
                ),
              S.divider(),
              S.listItem()
                .title('All Services')
                .child(S.documentTypeList('service').title('All Services')),
            ]),
        ),

      S.divider(),

      // Team
      S.listItem()
        .title('Team')
        .icon(UserIcon)
        .schemaType('teamMember')
        .child(S.documentTypeList('teamMember').title('Team Members')),
    ])
