import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useAuth } from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const { accessToken, user } = useAuth()

  if (!accessToken.value) {
    return navigateTo('/login', { replace: true })
  }
})