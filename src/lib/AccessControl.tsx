// lib/access.ts
import type { Access, FieldAccess } from "payload";
import { ROLES  } from "./contants";


// Check if user is admin
export const isAdmin: Access = ({ req: { user } }) => {
  return user?.roles?.includes(ROLES.ADMIN )   || false;
};

// Check if user is admin or editor
export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return (
    user?.roles?.includes(ROLES.ADMIN) ||
    user?.roles?.includes(ROLES.EDITOR) ||
    false
  );
};

// Users can only read/update their own account unless admin
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false;
  
  if (user.roles?.includes(ROLES.ADMIN)) {
    return true;
  }
  
  return {
    id: {
      equals: user.id,
    },
  };
};

// Field-level access: only admins can modify roles
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return user?.roles?.includes(ROLES.ADMIN) || false;
};

// Posts: Admins can access all, editors/customers can only access their own
export const canAccessPosts: Access = ({ req: { user } }) => {
  if (!user) return false;

  // Admins can access all posts
  if (user.roles?.includes(ROLES.ADMIN)) {
    return true;
  }

  // Editors can only access their own posts
  if (user.roles?.includes(ROLES.EDITOR)) {
    return {
      author: {
        equals: user.id,
      },
    };
  }

  // Customers cannot access posts in admin
  return false;
};

// Only admins and editors can create posts
export const canCreatePosts: Access = ({ req: { user } }) => {
  return isAdminOrEditor({ req: { user } });
};

// Users can only update their own posts, admins can update all
export const canUpdatePosts: Access = ({ req: { user } }) => {
  if (!user) return false;

  // Admins can update all posts
  if (user.roles?.includes(ROLES.ADMIN)) {
    return true;
  }

  // Editors can only update their own posts
  if (user.roles?.includes(ROLES.EDITOR)) {
    return {
      author: {
        equals: user.id,
      },
    };
  }

  return false;
};

// Only admins can delete posts
export const canDeletePosts: Access = ({ req: { user } }) => {
  return isAdmin({ req: { user } });
};