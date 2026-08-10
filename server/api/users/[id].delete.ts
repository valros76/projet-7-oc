import { db } from '~~/server/utils/drizzle'
import { users } from '@server/database/schema'
import { protectRoute } from '@server/utils/auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const currentUser = protectRoute(event)
  const targetUserId = Number(getRouterParam(event, 'id'))

  if (currentUser.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Accès réservé aux administrateurs.' })
  }

  if (!targetUserId || isNaN(targetUserId)) {
    throw createError({ statusCode: 400, message: 'ID utilisateur invalide.' })
  }

  // Empêcher l'admin de supprimer son propre compte
  if (currentUser.userId === targetUserId) {
    throw createError({ statusCode: 400, message: "Vous ne pouvez pas supprimer votre propre compte." })
  }

  await db.delete(users).where(eq(users.id, targetUserId))

  return { success: true, message: 'Utilisateur supprimé avec succès.' }
})