import Link from 'next/link'
import PageSection from '@/components/page/page-section'
import PageSectionContent from '@/components/page/page-section-content'
import PageSectionHeader from '@/components/page/page-section-header'
import { client } from '@/sanity/client'
import { hasSanityConfig } from '@/sanity/env'
import { getSiteDictionary } from '@/sanity/lib/getSiteSettings'
import { blogPostsQuery } from '@/sanity/queries'
import { PageSectionVariant } from '@/types/page'

type BlogPostListItem = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
}

async function getBlogPosts() {
  if (!hasSanityConfig) return []

  try {
    return await client.fetch<BlogPostListItem[]>(
      blogPostsQuery,
      {},
      {next: {revalidate: 60}},
    )
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const $t = await getSiteDictionary()
  const posts = await getBlogPosts()

  return (
    <PageSection id={$t.blog.id} variant={PageSectionVariant.Primary} showBorder={true}>
      <PageSectionHeader>{$t.blog.heading}</PageSectionHeader>
      <PageSectionContent>
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-8 md:px-8 md:py-10">
          {posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">{$t.blog.empty}</p>
          ) : posts.map((post) => (
            <article key={post._id} className="border-b border-border pb-4">
              <Link href={`/blog/${post.slug}`} className="text-lg font-semibold hover:underline">
                {post.title}
              </Link>
              {post.excerpt && <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>}
            </article>
          ))}
        </div>
      </PageSectionContent>
    </PageSection>
  )
}
