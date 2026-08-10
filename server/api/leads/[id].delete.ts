import { db } from '~~/server/utils/drizzle'
import { leads } from '@server/database/schema'
import { protectRoute } from '@server/utils/auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = protectRoute(event)
  const leadId = Number(getRouterParam(event, 'id'))

  if (!leadId || isNaN(leadId)) {
    throw createError({ statusCode: 400, message: 'ID invalide' })
  }

  // RÈGLE : Un apporteur ne peut PAS supprimer de lead
  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Seul un administrateur peut supprimer un lead.',
    })
  }

  await db.delete(leads).where(eq(leads.id, leadId))

  return { success: true, message: 'Lead supprimé avec succès.' }
})