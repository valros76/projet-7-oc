import { db } from '~~/server/utils/drizzle'
import { leads } from '@server/database/schema'
import { protectRoute } from '@server/utils/auth'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const currentUser = protectRoute(event)

  try {
    const userLeads = await db
      .select()
      .from(leads)
      .where(eq(leads.referrerId, currentUser.userId))
      .orderBy(desc(leads.createdAt))

    let countPending = 0
    let countValidated = 0
    let countPaid = 0

    userLeads.forEach((lead: any) => {
      if (lead.status === 'pending') {
        countPending++
      } else if (lead.status === 'accepted') {
        countValidated++
      } else if (lead.status === 'finished') {
        countPaid++
      }
    })

    return {
      success: true,
      stats: {
        pending: countPending,
        validated: countValidated,
        paid: countPaid,
        total: userLeads.length,
      },
      leads: userLeads,
    }
  } catch (error: any) {
    console.error('Erreur lors du chargement des stats:', error)
    throw createError({
      statusCode: 500,
      message: 'Impossible de récupérer vos statistiques.',
    })
  }
})