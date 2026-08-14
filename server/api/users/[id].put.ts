import { db } from '~~/server/utils/drizzle'
import { users } from '@server/database/schema'
import { protectRoute } from '@server/utils/auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const currentUser = protectRoute(event)
  const targetUserId = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (currentUser.role !== 'admin') {
    throw createError({ statusCode: 403, message: 'Accès réservé aux administrateurs.' })
  }

  if (!targetUserId || isNaN(targetUserId)) {
    throw createError({ statusCode: 400, message: 'ID utilisateur invalide.' })
  }

  // Empêcher l'admin de s'enlever ses propres droits par erreur
  if (currentUser.userId === targetUserId && body.role && body.role !== 'admin') {
    throw createError({ statusCode: 400, message: "Vous ne pouvez pas retirer vos propres droits administrateur." })
  }

  const updateData: Record<string, any> = {}
  if (body.role !== undefined) {
    if (!['admin', 'referrer'].includes(body.role)) {
      throw createError({ statusCode: 400, message: 'Rôle invalide.' })
    }
    updateData.role = body.role
  }

  await db.update(users).set(updateData).where(eq(users.id, targetUserId))

  return { success: true, message: 'Utilisateur mis à jour avec succès.' }
})