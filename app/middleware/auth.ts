import { defineNuxtRouteMiddleware, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const accessToken = useCookie('wdv_leads_access_token')

  if (!accessToken.value && to.path !== '/') {
    return navigateTo('/')
  }
})