import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Calendar, Tag, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getPosts,
  getExcerpt,
  formatPostDate,
  getCategoryName,
  getAuthorEmail,
  BLOG_REVALIDATE,
} from "@/lib/blog";

export const revalidate = BLOG_REVALIDATE;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.filter((post) => Boolean(post.slug)).map((post) => ({ slug: post.slug }));
}

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params }: PageProps) {
  const posts = await getPosts();
  const currentPost = posts.find((post) => post.slug === params.slug);

  if (!currentPost) {
    notFound();
  }

  const relatedPosts = posts.filter((post) => post.id !== currentPost.id).slice(0, 3);

  return (
    <div className="container py-12 max-w-4xl mx-auto ">
      <Button variant="ghost" size="sm" asChild className="mb-8">
        <Link href="/blog">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <article className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {getCategoryName(currentPost) && (
              <Badge variant="secondary">
                <Tag className="mr-1.5 h-3 w-3" />
                {getCategoryName(currentPost)}
              </Badge>
            )}
            {currentPost.createdAt && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatPostDate(currentPost.createdAt)}
              </div>
            )}
            {getAuthorEmail(currentPost) && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {getAuthorEmail(currentPost)}
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            {currentPost.title}
          </h1>

          {getExcerpt(currentPost) && (
            <p className="text-xl text-muted-foreground">
              {getExcerpt(currentPost)}
            </p>
          )}
        </div>

        <Separator />

        <Alert>
          <AlertDescription>
            This route is statically generated and revalidated every{" "}
            {BLOG_REVALIDATE} seconds. To invalidate the cache immediately
            after publishing, trigger the Payload revalidate hook for the{" "}
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              posts
            </code>{" "}
            tag.
          </AlertDescription>
        </Alert>

        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                [Integrate your Payload rich text renderer here to display the full content]
              </p>
            </div>
          </CardContent>
        </Card>
      </article>

      {relatedPosts.length > 0 && (
        <>
          <Separator className="my-12" />
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">More Posts</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">
                      <Link href={`/blog/${post.slug}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {getExcerpt(post, 100)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}