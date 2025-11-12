import { headers as getHeaders } from "next/headers.js";
import Image from "next/image";
import { getPayload } from "payload";
import React from "react";
import { fileURLToPath } from "url";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import config from "@/payload.config";

export default async function HomePage() {
  const headers = await getHeaders();
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig });
  const { user } = await payload.auth({ headers });

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Image
                alt="Payload Logo"
                height={48}
                src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-favicon.svg"
                width={48}
              />
              <div>
                <h1 className="text-3xl font-bold text-foreground">NextBlog</h1>
                <p className="text-sm text-muted-foreground">
                  Powered by Payload CMS
                </p>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-6">
            {!user && (
              <h2 className="text-2xl font-semibold text-foreground">
                Welcome to your blog platform
              </h2>
            )}
            {user && (
              <h2 className="text-2xl font-semibold text-foreground">
                Welcome back, {user.email}
              </h2>
            )}
            <p className="text-muted-foreground mt-2">
              Discover our latest articles and stories. Check out our blog to
              stay updated with fresh content and insights.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Blog Card */}
        <Card className="mb-8 border">
          <CardHeader>
            <CardTitle>Latest Blog Posts</CardTitle>
            <CardDescription>
              Explore our collection of articles and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-6">
              Stay up to date with the latest content from our blog. Read our
              featured articles, tips, and industry insights written by our team
              of experts.
            </p>
            <a href="/blog">
              <Button className="w-full sm:w-auto cursor-pointer ">View All Blog Posts</Button>
            </a>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Quick Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border">
            <CardHeader>
              <CardTitle className="text-lg">Admin Panel</CardTitle>
              <CardDescription>
                Manage your content, posts, and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={payloadConfig.routes.admin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full cursor-pointer ">
                  Go to Admin Panel
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader>
              <CardTitle className="text-lg">Documentation</CardTitle>
              <CardDescription>
                Learn more about Payload CMS and Next.js
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href="https://payloadcms.com/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full cursor-pointer ">
                  Read Docs
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-sm text-muted-foreground text-center mb-2">
            Edit this page in{" "}
            <a href={fileURL} className="underline hover:text-foreground">
              <code>app/(frontend)/page.tsx</code>
            </a>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Built with Next.js, Payload CMS, and shadcn/ui
          </p>
        </div>
      </div>
    </div>
  );
}
