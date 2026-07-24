export const useAuth = () => {
  const user = useState('auth_user', () => null as { id: number; email: string; firstName: string; lastName: string; role: string } | null)
  const accessToken = useState('auth_token', () => null as string | null)

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
    await $fetch('/api/auth/logout', { method: 'POST' })
    accessToken.value = null
    user.value = null
    navigateTo('/')
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