interface AuthUser {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthResponse {
  accessToken: string
  user: AuthUser
}

interface RefreshResponse {
  accessToken: string
}

export const useAuth = () => {
  const accessToken = useCookie<string | null>('auth_token', {
    maxAge: 60 * 15,
    sameSite: 'lax',
    default: () => null,
  })

  const user = useCookie<AuthUser | null>('auth_user', {
    default: () => null,
    sameSite: 'lax',
  })

  const login = async (
    credentials: {
      email: string
      password: string
    },
  ) => {
    const res = await $fetch<AuthResponse>(
      '/api/auth/login',
      {
        method: 'POST',
        body: credentials,
      },
    )

    accessToken.value = res.accessToken
    user.value = res.user

    return res
  }

  const register = async (
    data: Record<string, unknown>,
  ) => {
    return await $fetch(
      '/api/auth/register',
      {
        method: 'POST',
        body: data,
      },
    )
  }

  const logout = async () => {
    try {
      await $fetch(
        '/api/auth/logout',
        {
          method: 'POST',
        },
      )
    } catch {
    } finally {
      accessToken.value = null
      user.value = null

      await navigateTo('/')
    }
  }

  const refreshSession = async () => {
    try {
      const res = await $fetch<RefreshResponse>(
        '/api/auth/refresh',
        {
          method: 'POST',
        },
      )

      accessToken.value = res.accessToken

      return res
    } catch (error) {
      accessToken.value = null
      user.value = null

      throw error
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