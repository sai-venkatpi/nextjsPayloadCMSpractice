
export const ROLES ={
  EDITOR:"editor" ,
  ADMIN:"admin",
  CUSTOMER:"customer"
} as const

export type Role = typeof ROLES[keyof typeof ROLES];
