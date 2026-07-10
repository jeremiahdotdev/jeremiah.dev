import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {dataset, projectId} from './sanity/env'
import {schemaTypes} from './sanity/schemas'

export default defineConfig({
  name: 'jeremiah-dev',
  title: 'jeremiah.dev',
  projectId: projectId || 'missing-project-id',
  dataset,
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})
