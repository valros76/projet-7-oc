import { db } from '@server/utils/drizzle'
import { leads } from '@server/database/schema'
import { protectRoute } from '@server/utils/auth'
import type { LeadStatus } from '@shared/types'

export default defineEventHandler(async (event) => {
  const user = protectRoute(event)

  const body = await readBody(event)
  const { 
    companyName, 
    contactFirstName, 
    contactLastName, 
    clientEmail, 
    clientPhone, 
    missionTitle, 
    missionStartDate, 
    durationDays, 
    isIndefiniteDuration, 
    commissionRate,
    clientSiret
  } = body

  if (!companyName || !contactFirstName || !contactLastName || !clientEmail || !clientPhone || !missionTitle || !missionStartDate) {
    throw createError({
      statusCode: 400,
      message: 'Veuillez remplir tous les champs obligatoires du lead.',
    })
  }

  try {
    const [newLead] = await db.insert(leads).values({
      referrerId: user.userId,
      companyName,
      contactFirstName,
      contactLastName,
      clientEmail,
      clientPhone,
      missionTitle,
      missionStartDate,
      clientSiret: clientSiret || null,
      durationDays: durationDays ? Number(durationDays) : null,
      isIndefiniteDuration: Boolean(isIndefiniteDuration),
      commissionRate: commissionRate ? String(commissionRate) : '10.00',
      status: 'pending' as LeadStatus,
    }).$returningId()

    return {
      success: true,
      message: 'Lead créé avec succès.',
      leadId: newLead,
    }
  } catch (error: any) {
    console.error('Erreur technique (leads.post):', error)
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la création du lead en base de données.",
    })
  }
})