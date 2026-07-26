import { eq } from 'drizzle-orm'
import { db } from '@server/utils/drizzle'
import { users, refreshTokens } from '@server/database/schema'

export const userRepository = {
  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1)
    return user || null
  },

  async findById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
    return user || null
  },

  async createUser(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    role?: 'admin' | 'referrer'
  }) {
    const [result] = await db.insert(users).values({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role || 'referrer',
    })
    return result.insertId
  },

  async saveRefreshToken(userId: number, token: string, expiresAt: Date) {
    await db.insert(refreshTokens).values({
      userId,
      token,
      expiresAt,
    })
  },

  async deleteRefreshToken(token: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token))
  },

  async findRefreshToken(token: string) {
    const [storedToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token)).limit(1)
    return storedToken || null
  }
}