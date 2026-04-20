import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAllPosts } from "@/lib/notion/notion-public";

export const revalidate = 300;

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.pageId !== featured?.pageId);

  return (
    <main className="mx-auto max-w-6xl px-6 pt-28 pb-24">
      <header className="mb-16 text-center">
        <p className="mb-3 text-sm font-medium tracking-wider text-neutral-500 uppercase">
          Lufra Blog
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl">
          Insights & Updates
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-neutral-600">
          Guides, product updates, and behind-the-scenes stories from the Lufra team.
        </p>
      </header>

      {featured && (
        <Link href={`/blog/${featured.slug}`} className="group mb-16 block">
          <Card className="overflow-hidden transition-shadow hover:shadow-md">
            <div className="grid gap-0 md:grid-cols-2">
              {featured.coverImage ? (
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100 md:aspect-auto">
                  <Image
                    src={featured.coverImage}
                    alt={featured.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-[16/10] bg-neutral-100 md:aspect-auto" />
              )}
              <CardContent className="flex flex-col justify-center gap-4 px-8 py-10">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Featured</Badge>
                  {featured.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag.pageId} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 group-hover:text-neutral-700 md:text-3xl">
                  {featured.name}
                </h2>
                {featured.excerpt && (
                  <p className="line-clamp-3 text-neutral-600">{featured.excerpt}</p>
                )}
                {featured.authors.length > 0 && (
                  <p className="text-sm text-neutral-500">
                    By {featured.authors.map((a) => a.name).join(", ")}
                  </p>
                )}
              </CardContent>
            </div>
          </Card>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.pageId} href={`/blog/${post.slug}`} className="group block">
              <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                {post.coverImage && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                    <Image
                      src={post.coverImage}
                      alt={post.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardContent className="flex flex-col gap-3 px-6 py-6">
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag.pageId} variant="secondary">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-neutral-900 group-hover:text-neutral-700">
                    {post.name}
                  </h3>
                  {post.excerpt && (
                    <p className="line-clamp-2 text-sm text-neutral-600">{post.excerpt}</p>
                  )}
                  {post.authors.length > 0 && (
                    <p className="mt-auto pt-2 text-xs text-neutral-500">
                      By {post.authors.map((a) => a.name).join(", ")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 && (
        <p className="text-center text-neutral-500">No posts yet. Check back soon.</p>
      )}
    </main>
  );
}
