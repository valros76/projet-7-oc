export interface TokenPayload {
  userId: number
  email?: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password: string
}