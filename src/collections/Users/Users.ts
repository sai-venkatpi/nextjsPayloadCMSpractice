
import type { CollectionConfig } from "payload";
import { isAdmin, isAdminOrSelf, isAdminFieldLevel } from "@/lib/AccessControl";
import { ROLES } from "@/lib/contants";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  access: {
    // Anyone can create an account (registration)
    create: () => true,
    // Users can read their own data, admins can read all
    read: isAdminOrSelf,
    // Users can update their own data, admins can update all
    update: isAdminOrSelf,
    // Only admins can delete users
    delete: isAdmin,
  },
  fields: [
    {
      name: "roles",
      saveToJWT: true,
      type: "select",
      hasMany: true,
      defaultValue: ["customer"], // Default new users to customer
      access: {
        // Only admins can create or update roles
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
        // Non-admins cannot see the roles field
        read: isAdminFieldLevel,
      },
      options: [
        {
          label: "Admin",
          value: ROLES.ADMIN,
        },
        {
          label: "Editor",
          value: ROLES.EDITOR,
        },
        {
          label: "Customer",
          value: ROLES.CUSTOMER,
        },
      ],
    },
  ],
};