import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  title,
  description,
  dictionary
}`

export const blogPostsQuery = groq`*[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt
}`

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  body
}`

export const careerEmployersQuery = groq`*[_type == "careerEmployer"] | order(orderRank asc, name asc) {
  name,
  location,
  roles[] {
    title,
    employmentType,
    startDate,
    endDate,
    description,
    skills[]->{
      title,
      subtitle,
      tooltip,
      iconKey,
      icon{asset->{url}},
      href
    }
  }
}`

export const academicRecordQuery = groq`*[_type == "academicRecord"][0]{
  degree,
  institution,
  location,
  startDate,
  endDate,
  description,
  focuses[] {
    type,
    name,
    gpa,
    description
  },
  commendations[] {
    title,
    subtitle,
    tooltip,
    dates,
    iconKey,
    link
  }
}`
