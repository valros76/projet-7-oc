import { db } from '~~/server/utils/drizzle'
import { leads } from '@server/database/schema'
import { protectRoute } from '@server/utils/auth'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = protectRoute(event)
  const leadId = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  if (!leadId || isNaN(leadId)) {
    throw createError({ statusCode: 400, message: 'ID invalide' })
  }

  // 1. Récupération du lead existant
  const existingLeads = await db
    .select()
    .from(leads)
    .where(eq(leads.id, leadId))
    .limit(1)

  const existingLead = existingLeads[0]

  if (!existingLead) {
    throw createError({ statusCode: 404, message: 'Lead introuvable' })
  }

  // 2. Vérification de propriété pour les apporteurs
  if (user.role !== 'admin' && existingLead.referrerId !== user.userId) {
    throw createError({ statusCode: 403, message: 'Accès non autorisé à ce lead.' })
  }

  // 3. RÈGLE : L'apporteur ne peut modifier QUE si le lead est déjà validé par un admin
  if (user.role !== 'admin' && existingLead.status !== 'accepted') {
    throw createError({
      statusCode: 403,
      message: "Vous ne pouvez pas modifier ce lead tant qu'il n'a pas été validé par un administrateur.",
    })
  }

  // 4. Préparation des données mises à jour selon le rôle
  const updateData: Record<string, any> = {
    companyName: body.companyName,
    clientSiret: body.clientSiret,
    contactFirstName: body.contactFirstName,
    contactLastName: body.contactLastName,
    clientEmail: body.clientEmail,
    clientPhone: body.clientPhone,
    missionTitle: body.missionTitle,
    missionStartDate: body.missionStartDate,
    durationDays: body.durationDays,
    isIndefiniteDuration: body.isIndefiniteDuration,
  }

  // RÈGLE : Seul l'ADMIN a le droit de modifier le statut et la commission après création
  if (user.role === 'admin') {
    if (body.commissionRate !== undefined) updateData.commissionRate = body.commissionRate
    if (body.status !== undefined) updateData.status = body.status
  }

  await db.update(leads).set(updateData).where(eq(leads.id, leadId))

  return { success: true, message: 'Lead mis à jour avec succès.' }
})