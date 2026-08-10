import { db } from '~~/server/utils/drizzle'
import { leads, users } from '@server/database/schema'
import { protectRoute } from '@server/utils/auth'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = protectRoute(event)

  try {
    let userLeads

    if (user.role === 'admin') {
      userLeads = await db
        .select({
          id: leads.id,
          companyName: leads.companyName,
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
          referrerFirstName: users.firstName,
          referrerLastName: users.lastName,
          referrerEmail: users.email,
        })
        .from(leads)
        .leftJoin(users, eq(leads.referrerId, users.id))
        .orderBy(desc(leads.createdAt))
    } else {
      userLeads = await db
        .select()
        .from(leads)
        .where(eq(leads.referrerId, user.userId))
        .orderBy(desc(leads.createdAt))
    }

    return {
      success: true,
      leads: userLeads,
    }
  } catch (error: any) {
    console.error('Erreur lors de la récupération des leads:', error)
    throw createError({
      statusCode: 500,
      message: 'Impossible de récupérer la liste des leads.',
    })
  }
})