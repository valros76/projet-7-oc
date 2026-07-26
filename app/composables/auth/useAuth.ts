export const useAuth = () => {
  // Utilisation de useCookie pour persister le token à travers les rechargements (F5) et le SSR
  const accessToken = useCookie('auth_token', {
    maxAge: 60 * 15, // Ajustez selon la durée de vie de votre access token (ex: 15 minutes)
    sameSite: 'lax',
  })

  // Stockage de l'utilisateur dans un cookie ou un state persistant
  const user = useCookie('auth_user', {
    default: () => null as { id: number; email: string; firstName: string; lastName: string; role: string } | null,
    sameSite: 'lax',
  })

  const login = async (credentials: { email: string; password: string }) => {
    const res: any = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials,
    })
    accessToken.value = res.accessToken
    user.value = res.user
  }

  const register = async (data: any) => {
    return await $fetch('/api/auth/register', {
      method: 'POST',
      body: data,
    })
  }

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Ignore network errors on logout
    } finally {
      accessToken.value = null
      user.value = null
      navigateTo('/')
    }
  }

  const refreshSession = async () => {
    try {
      const res: any = await $fetch('/api/auth/refresh', {
        method: 'POST',
      })
      accessToken.value = res.accessToken
    } catch {
      accessToken.value = null
      user.value = null
    }
  }

  return {
    user: readonly(user),
    accessToken: readonly(accessToken),
    login,
    register,
    logout,
    refreshSession,
  }
}