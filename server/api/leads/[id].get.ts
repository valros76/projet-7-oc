import { db } from '~~/server/utils/drizzle'
import { leads } from '@server/database/schema'
import { protectRoute } from '@server/utils/auth'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = protectRoute(event)
  const leadId = Number(getRouterParam(event, 'id'))

  if (!leadId || isNaN(leadId)) {
    throw createError({ statusCode: 400, message: 'ID invalide' })
  }

  const queryCondition = user.role === 'admin'
    ? eq(leads.id, leadId)
    : and(eq(leads.id, leadId), eq(leads.referrerId, user.userId))

  const result = await db
    .select({
      id: leads.id,
      companyName: leads.companyName,
      clientSiret: leads.clientSiret,
      contactFirstName: leads.contactFirstName,
      contactLastName: leads.contactLastName,
      clientEmail: leads.clientEmail,
      clientPhone: leads.clientPhone,
      missionTitle: leads.missionTitle,
      missionStartDate: leads.missionStartDate,
      durationDays: leads.durationDays,
      isIndefiniteDuration: leads.isIndefiniteDuration,
      commissionRate: leads.commissionRate,
      status: leads.status,
      createdAt: leads.createdAt,
      referrerId: leads.referrerId,
    })
    .from(leads)
    .where(queryCondition)
    .limit(1)

  const lead = result[0]

  if (!lead) {
    throw createError({ statusCode: 404, message: 'Lead introuvable ou accès non autorisé.' })
  }

  return { success: true, lead }
})