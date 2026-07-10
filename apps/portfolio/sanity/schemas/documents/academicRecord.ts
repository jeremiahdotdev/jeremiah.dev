import {defineField, defineType} from 'sanity'

export const academicRecord = defineType({
  name: 'academicRecord',
  title: 'Academic Record',
  type: 'document',
  fields: [
    defineField({name: 'degree', title: 'Degree', type: 'string'}),
    defineField({name: 'institution', title: 'Institution', type: 'string'}),
    defineField({name: 'location', title: 'Location', type: 'string'}),
    defineField({name: 'startDate', title: 'Start date', type: 'date'}),
    defineField({name: 'endDate', title: 'End date', type: 'date'}),
    defineField({name: 'description', title: 'Summary', type: 'blockContent'}),
    defineField({
      name: 'focuses',
      title: 'Focuses',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'type', title: 'Type', type: 'string'},
          {name: 'name', title: 'Name', type: 'string'},
          {name: 'gpa', title: 'GPA', type: 'string'},
          {name: 'description', title: 'Description', type: 'blockContent'},
        ],
      }],
    }),
    defineField({
      name: 'commendations',
      title: 'Commendations',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {name: 'title', title: 'Title', type: 'string'},
          {name: 'subtitle', title: 'Subtitle', type: 'string'},
          {name: 'tooltip', title: 'Tooltip', type: 'string'},
          {name: 'dates', title: 'Dates', type: 'string'},
          {name: 'iconKey', title: 'Icon key', type: 'string'},
          {name: 'link', title: 'Link', type: 'url'},
        ],
      }],
    }),
  ],
})
