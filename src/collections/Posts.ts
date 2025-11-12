
// collections/Posts.ts
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
} from "@payloadcms/plugin-seo/fields";
import {
  BlocksFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  lexicalEditor,
  CodeBlock,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";
import {
  canCreatePosts,
  canUpdatePosts,
  canDeletePosts,
} from "@/lib/AccessControl";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "category", "author", "updatedAt"],
  },
  access: {
    // Public can read published posts (you may want to add a 'published' field)
    read: () => true, // Or implement logic for published posts only
    // Only admins and editors can create
    create: canCreatePosts,
    // Admins can update all, editors can update their own
    update: canUpdatePosts,
    // Only admins can delete
    delete: canDeletePosts,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Body",
          description: "This is the body of the post",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
            },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              admin: {
                position: "sidebar",
                description: "URL-friendly version of the title",
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    // Auto-generate slug from title if not provided
                    if (!value && data?.title) {
                      return data.title
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '') // Remove special characters
                        .replace(/\s+/g, '-') // Replace spaces with hyphens
                        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
                        .trim();
                    }
                    // Clean up manually entered slug
                    if (value) {
                      return value
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .trim();
                    }
                    return value;
                  },
                ],
              },
            },
            {
              name: "content",
              type: "richText",
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({
                    enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
                  }),
                  BlocksFeature({ blocks: [CodeBlock()] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
            {
              name: "category",
              type: "relationship",
              relationTo: "category",
              hasMany: false,
            },
            {
              name: "author",
              type: "relationship",
              relationTo: "users",
              hasMany: false,
              required: true,
              // Automatically set author to current user
              admin: {
                condition: (data, siblingData, { user }) => {
                  // Hide field for non-admins (auto-set on create)
                  return user?.roles?.includes("admin");
                },
              },
              // Auto-set author to current user on create
              hooks: {
                beforeChange: [
                  ({ req, operation, value }) => {
                    if (operation === "create" && !value && req.user) {
                      return req.user.id;
                    }
                    return value;
                  },
                ],
              },
            },
          ],
        },
        {
          name: "metadata",
          label: "SEO",
          fields: [
            OverviewField({
              titlePath: "meta.title",
              descriptionPath: "meta.description",
              imagePath: "meta.image",
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: "media",
            }),
            MetaDescriptionField({}),
          ],
        },
      ],
    },
  ],
};