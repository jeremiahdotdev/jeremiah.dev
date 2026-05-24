import {defineField, defineType} from 'sanity'

export const careerEmployer = defineType({
  name: 'careerEmployer',
  title: 'Career Employer',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Employer', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({
      name: 'icon',
      title: 'Timeline icon',
      type: 'file',
      options: {
        accept: 'image/svg+xml,image/png,image/jpeg,image/webp',
      },
    }),
    defineField({name: 'orderRank', title: 'Sort order', type: 'number'}),
    defineField({
      name: 'roles',
      title: 'Roles',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'title', title: 'Title', type: 'string'},
          {name: 'employmentType', title: 'Employment type', type: 'string'},
          {name: 'startDate', title: 'Start date', type: 'date'},
          {name: 'endDate', title: 'End date', type: 'date'},
          {name: 'description', title: 'Description', type: 'blockContent'},
          {name: 'skills', title: 'Skills', type: 'array', of: [{type: 'reference', to: [{type: 'skill'}]}]},
        ],
      }],
    }),
  ],
})
