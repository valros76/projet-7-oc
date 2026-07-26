export type UserRole = "admin" | "referrer"

export interface User {
  id: number
  role: UserRole
  firstName: string
  lastName: string
  email: string
  phone: string
  siret?: string | null
  iban?: string | null
  affiliateCode?: string | null
  createdAt?: string
  updatedAt?: string
}