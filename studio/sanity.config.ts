import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {structure} from './structure'

// The project id and dataset are not secrets (studio/sanity.cli.ts already ships them, and the
// public CDN queries use them), and defaulting them here is what lets `sanity build` run without
// an .env file. SANITY_STUDIO_* still wins, so a staging dataset can be pointed at.
export default defineConfig({
  name: 'rdvs-studio',
  title: 'RDVS Studio CMS',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'lqnpv8ns',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    // Site Settings is a singleton: structure.ts pins it to one document id, and filtering the
    // create/delete actions is what stops an editor making a second one. (The `documents: [...]`
    // shape used here is not part of Sanity's config API — `sanity build` typechecked it as an
    // unknown property and the affordances were never actually removed.)
    actions: (prev: any[], context: any) =>
      context.schemaType === 'siteSettings'
        ? prev.filter((action) => action.type !== 'create' && action.type !== 'delete')
        : prev,
  },
})
