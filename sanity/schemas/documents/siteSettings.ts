import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Site title', type: 'string'}),
    defineField({name: 'description', title: 'Meta description', type: 'text', rows: 2}),
    defineField({
      name: 'dictionary',
      title: 'Static Site Text',
      type: 'object',
      fields: [
        defineField({name: 'theme', title: 'Theme', type: 'object', fields: [
          {name: 'toggle', title: 'Toggle label', type: 'string'},
          {name: 'light', title: 'Light label', type: 'string'},
          {name: 'dark', title: 'Dark label', type: 'string'},
          {name: 'system', title: 'System label', type: 'string'},
          {name: 'keys', title: 'Theme keys', type: 'object', fields: [
            {name: 'light', title: 'Light key', type: 'string'},
            {name: 'dark', title: 'Dark key', type: 'string'},
            {name: 'dev', title: 'Dev key', type: 'string'},
          ]},
        ]}),
        defineField({name: 'menu', title: 'Menu', type: 'object', fields: [
          {name: 'toggle', title: 'Toggle label', type: 'string'},
          {name: 'heading', title: 'Heading', type: 'string'},
          {name: 'description', title: 'Description', type: 'string'},
        ]}),
        defineField({name: 'controls', title: 'Controls', type: 'object', fields: [
          {name: 'linkedIn', title: 'LinkedIn label', type: 'string'},
          {name: 'resume', title: 'Resume label', type: 'string'},
        ]}),
        defineField({name: 'navigation', title: 'Navigation', type: 'array', of: [{type: 'object', fields: [
          {name: 'id', title: 'Section ID', type: 'string'},
          {name: 'heading', title: 'Heading', type: 'string'},
        ]}]}),
        defineField({name: 'home', title: 'Home', type: 'object', fields: [
          {name: 'id', title: 'Section ID', type: 'string'},
          {name: 'heading', title: 'Heading', type: 'string'},
          {name: 'typeHeading', title: 'Type headings', type: 'array', of: [{type: 'string'}]},
          {name: 'typeHeadingEnd', title: 'Type heading end', type: 'string'},
        ]}),
        defineField({name: 'timeline', title: 'Timeline', type: 'object', fields: [
          {name: 'endDateDefault', title: 'Default end date', type: 'string'},
        ]}),
        defineField({name: 'career', title: 'Career', type: 'object', fields: [
          {name: 'id', title: 'Section ID', type: 'string'},
          {name: 'heading', title: 'Heading', type: 'string'},
        ]}),
        defineField({name: 'academics', title: 'Academics', type: 'object', fields: [
          {name: 'id', title: 'Section ID', type: 'string'},
          {name: 'heading', title: 'Heading', type: 'string'},
          {name: 'cofo', title: 'Institution URL', type: 'url'},
          {name: 'focus', title: 'Focus labels', type: 'object', fields: [
            {name: 'gpaLabel', title: 'GPA label', type: 'string'},
          ]},
        ]}),
        defineField({name: 'projects', title: 'Projects', type: 'object', fields: [
          {name: 'id', title: 'Section ID', type: 'string'},
          {name: 'heading', title: 'Heading', type: 'string'},
          {name: 'description', title: 'Description', type: 'string'},
          {name: 'info', title: 'Info', type: 'text'},
          {name: 'instruction', title: 'Instruction', type: 'string'},
          {name: 'placeholder', title: 'Placeholder', type: 'string'},
          {name: 'viewDemo', title: 'View demo label', type: 'string'},
          {name: 'closeDemo', title: 'Close demo label', type: 'string'},
          {name: 'languages', title: 'Languages label', type: 'string'},
          {name: 'github', title: 'GitHub labels', type: 'object', fields: [
            {name: 'link', title: 'Link label', type: 'string'},
            {name: 'public', title: 'Public label', type: 'string'},
            {name: 'private', title: 'Private label', type: 'string'},
          ]},
        ]}),
        defineField({name: 'blog', title: 'Blog', type: 'object', fields: [
          {name: 'id', title: 'Section ID', type: 'string'},
          {name: 'heading', title: 'Heading', type: 'string'},
          {name: 'empty', title: 'Empty state', type: 'string'},
        ]}),
        defineField({name: 'contact', title: 'Contact', type: 'object', fields: [
          {name: 'id', title: 'Section ID', type: 'string'},
          {name: 'heading', title: 'Heading', type: 'string'},
          {name: 'email', title: 'Email field', type: 'object', fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'placeholder', title: 'Placeholder', type: 'string'},
            {name: 'description', title: 'Description', type: 'string'},
          ]},
          {name: 'subject', title: 'Subject field', type: 'object', fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'placeholder', title: 'Placeholder', type: 'string'},
            {name: 'description', title: 'Description', type: 'string'},
          ]},
          {name: 'body', title: 'Body field', type: 'object', fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'placeholder', title: 'Placeholder', type: 'string'},
            {name: 'description', title: 'Description', type: 'string'},
          ]},
          {name: 'button', title: 'Button labels', type: 'object', fields: [
            {name: 'label', title: 'Submit label', type: 'string'},
            {name: 'pastAttemptThreshold', title: 'Rate limited label', type: 'string'},
          ]},
          {name: 'successMessage', title: 'Success message', type: 'string'},
          {name: 'failureMessage', title: 'Failure message', type: 'string'},
          {name: 'captchaFailed', title: 'Captcha failed message', type: 'string'},
          {name: 'tooManyRequests', title: 'Too many requests message', type: 'string'},
        ]}),
        defineField({name: 'footer', title: 'Footer', type: 'object', fields: [
          {name: 'copyright', title: 'Copyright', type: 'string'},
          {name: 'captcha', title: 'Captcha notice', type: 'object', fields: [
            {name: 'url', title: 'URL', type: 'url'},
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'captcha', title: 'Captcha text', type: 'string'},
          ]},
        ]}),
        defineField({name: 'links', title: 'Links', type: 'object', fields: [
          {name: 'linkedIn', title: 'LinkedIn URL', type: 'url'},
          {name: 'resume', title: 'Resume URL', type: 'url'},
        ]}),
        defineField({name: 'dev', title: 'Developer note', type: 'text'}),
      ],
    }),
  ],
})
