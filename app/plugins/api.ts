import type { $Fetch } from 'nitropack'

export default defineNuxtPlugin(() => {
  const { accessToken, refreshSession, logout } = useAuth()

  // 👈 Indiquer explicitement le type de l'instance $Fetch
  const api: $Fetch = $fetch.create({
    async onRequest({ options }) {
      if (!accessToken.value) {
        try {
          await refreshSession()
        } catch {
          // Échec du refresh silencieux
        }
      }

      if (accessToken.value) {
        options.headers = new Headers(options.headers || {})
        options.headers.set('Authorization', `Bearer ${accessToken.value}`)
      }
    },

    async onResponseError({ request, options, response }): Promise<any> {
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
            
            // Relancer la requête avec l'instance typée
            return api(request, options as any)
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