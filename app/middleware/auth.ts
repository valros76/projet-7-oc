import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuth } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const accessToken = useCookie('wdv_leads_access_token')

  if (!accessToken.value) {
    return navigateTo('/', { replace: true })
  }
})