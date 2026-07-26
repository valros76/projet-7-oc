import { db } from '@server/utils/drizzle'
import { leads } from '@server/database/schema'
import { protectRoute } from '@server/utils/auth'

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
    commissionRate 
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
      durationDays: durationDays || null,
      isIndefiniteDuration: isIndefiniteDuration ?? false,
      commissionRate: commissionRate || '10.00',
      status: 'pending',
    }).$returningId()

    return {
      success: true,
      message: 'Lead créé avec succès.',
      leadId: newLead,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la création du lead en base de données.",
    })
  }
})