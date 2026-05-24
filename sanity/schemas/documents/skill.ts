import {defineField, defineType} from 'sanity'

export const skill = defineType({
  name: 'skill',
  title: 'Skill',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'subtitle', title: 'Badge subtitle', type: 'string'}),
    defineField({name: 'tooltip', title: 'Tooltip', type: 'string'}),
    defineField({name: 'iconKey', title: 'Icon key', type: 'string'}),
    defineField({name: 'href', title: 'URL', type: 'url'}),
  ],
})
