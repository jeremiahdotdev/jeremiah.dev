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
        preview: {select: {title: 'name', subtitle: '_key'}},
        fields: [
          {name: 'type', title: 'Type', type: 'string'},
          {name: 'name', title: 'Name', type: 'string'},
          {name: 'gpa', title: 'GPA', type: 'string'},
          {name: 'icon', title: 'Icon', type: 'file', options: {accept: 'image/svg+xml'}},
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
          {name: 'label', title: 'Badge label', type: 'string', description: 'Compact badge text. Defaults to the subtitle followed by the title when omitted.'},
          defineField({
            name: 'focusKey',
            title: 'Focus key',
            type: 'string',
            description: 'Use the key displayed beneath a focus name above. Leave blank to show this as a general commendation.',
            validation: (rule) => rule.custom((value, context) => {
              if (!value) return true
              const focuses = context.document?.focuses as Array<{_key: string}> | undefined
              return focuses?.some((focus) => focus._key === value) || 'Use the key of a focus in this academic record, or leave blank.'
            }),
          }),
          {name: 'tooltip', title: 'Tooltip', type: 'string'},
          {name: 'dates', title: 'Dates', type: 'string'},
          {name: 'iconKey', title: 'Icon key', type: 'string'},
          {name: 'link', title: 'Link', type: 'url'},
        ],
      }],
    }),
  ],
})
