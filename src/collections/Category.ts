import type { CollectionConfig } from "payload";

export const Category: CollectionConfig = {
  slug: "category",
admin:{
   useAsTitle:"title",
   defaultColumns:["title"]
},
  fields: [
    {
      name: "title",
      required: true,
      type: "text",
      unique: true,
    },
  ],
};
