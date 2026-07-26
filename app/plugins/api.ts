export default defineNuxtPlugin(async () => {
  const { accessToken, refreshSession, logout } = useAuth()

  // On tente de récupérer un access token frais si la mémoire est vide
  if (!accessToken.value) {
    try {
      await refreshSession()
    } catch {
      // Pas de session valide, l'utilisateur reste non authentifié
    }
  }

  const api = $fetch.create({
    onRequest({ options }) {
      if (accessToken.value) {
        options.headers = new Headers(options.headers || {})
        options.headers.set('Authorization', `Bearer ${accessToken.value}`)
      }
    },
    async onResponseError({ request, options, response }) {
      if (response.status === 401) {
        if (typeof request === 'string' && request.includes('/api/auth/refresh')) {
          await logout()
          return
        }

        try {
          await refreshSession()

          if (accessToken.value) {
            options.headers = new Headers(options.headers || {})
            options.headers.set('Authorization', `Bearer ${accessToken.value}`)
            
            return ($fetch as any)(request, options)
          }
        } catch (refreshError) {
          await logout()
        }
      }
    },
  })

  return {
    provide: {
      api,
    },
  }
})