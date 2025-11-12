import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPosts,
  getExcerpt,
  formatPostDate,
  getCategoryName,
  getAuthorEmail,
  BLOG_REVALIDATE,
} from "@/lib/blog";

export const revalidate = BLOG_REVALIDATE;

export default async function BlogPage() {
  const posts = await getPosts();
  const [featuredPost, ...otherPosts] = posts;

  if (posts.length === 0) {
    return (
      <div className="container py-24 ">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>No Posts Yet</CardTitle>
            <CardDescription>Check back soon for new content!</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 space-y-12 mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Insights, stories, and ideas from our team
        </p>
      </div>

      {featuredPost && (
        <Card className="overflow-hidden">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              {getCategoryName(featuredPost) && (
                <Badge variant="secondary">{getCategoryName(featuredPost)}</Badge>
              )}
              {featuredPost.createdAt && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatPostDate(featuredPost.createdAt)}
                </div>
              )}
            </div>
            <CardTitle className="text-3xl">
              <Link href={`/blog/${featuredPost.slug}`} className="hover:underline">
                {featuredPost.title}
              </Link>
            </CardTitle>
            <CardDescription className="text-base">
              {getExcerpt(featuredPost, 200)}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex items-center justify-between">
            {getAuthorEmail(featuredPost) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {getAuthorEmail(featuredPost)}
              </div>
            )}
            <Button asChild>
              <Link href={`/blog/${featuredPost.slug}`}>
                Read Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}

      {otherPosts.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Latest Posts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map((post) => (
              <Card key={post.id} className="flex flex-col">
                <CardHeader>
                  {getCategoryName(post) && (
                    <Badge variant="outline" className="w-fit">{getCategoryName(post)}</Badge>
                  )}
                  <CardTitle className="line-clamp-2 mt-2">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {getExcerpt(post, 120)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {post.createdAt && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatPostDate(post.createdAt)}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" asChild className="w-full">
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}