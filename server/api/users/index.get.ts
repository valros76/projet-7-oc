import { db } from '~~/server/utils/drizzle'
import { users } from '@server/database/schema'
import { protectRoute } from '@server/utils/auth'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const currentUser = protectRoute(event)

  if (currentUser.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Accès réservé aux administrateurs.' })
  }

  try {
    const allUsers = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        phone: users.phone,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))

    return {
      success: true,
      users: allUsers,
    }
  } catch (error: any) {
    console.error('Erreur lors de la récupération des utilisateurs:', error)
    throw createError({
      statusCode: 500,
      message: 'Impossible de récupérer la liste des utilisateurs.',
    })
  }
})