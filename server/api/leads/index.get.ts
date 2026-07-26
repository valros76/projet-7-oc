import { db } from '@server/utils/drizzle'
import { leads } from '@server/database/schema'
import { eq } from 'drizzle-orm'
import { protectRoute } from '@server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = protectRoute(event)

  try {
    const userLeads = await db.select().from(leads)

    return {
      success: true,
      leads: userLeads,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur lors de la récupération des leads.",
    })
  }
})