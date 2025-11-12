import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";

import type { Post } from "@/payload-types";
import configPromise from "@/payload.config";

export const BLOG_REVALIDATE = 120;

const getPayloadClient = cache(async () => {
  const config = await configPromise;
  return getPayload({ config });
});

export const getPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const payload = await getPayloadClient();

    const result = await payload.find({
      collection: "posts",
      depth: 2,
      sort: "-createdAt",
    });

    return result.docs as unknown as Post[];
  },
  ["payload-posts"],
  {
    revalidate: BLOG_REVALIDATE,
    tags: ["posts"],
  }
);

export function extractPlainText(node: any): string {
  if (!node) return "";

  if (Array.isArray(node)) {
    return node.map(extractPlainText).filter(Boolean).join(" ");
  }

  if (typeof node !== "object") return "";

  if (typeof node.text === "string") {
    return node.text;
  }

  if (node.children) {
    return extractPlainText(node.children);
  }

  return "";
}

export function getExcerpt(post: Post, maxLength = 280): string | null {
  if (!post.content || !post.content.root) return null;
  const plainText = extractPlainText(post.content.root.children || []);
  const trimmed = plainText.trim();
  if (!trimmed) return null;
  return trimmed.length > maxLength 
    ? `${trimmed.slice(0, maxLength - 3)}...` 
    : trimmed;
}

export function formatPostDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function getCategoryName(post: Post): string | undefined {
  return post.category && typeof post.category === "object"
    ? post.category.title
    : undefined;
}

export function getAuthorEmail(post: Post): string | undefined {
  return post.author && typeof post.author === "object"
    ? post.author.email
    : undefined;
}