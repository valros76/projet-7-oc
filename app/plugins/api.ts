import type { FetchError, FetchOptions, FetchRequest } from 'ofetch'
import { useAuth } from '~/composables/auth/useAuth'

type HTTPMethod =
  | 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE'
  | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'head' | 'options' | 'connect' | 'trace'

export interface CustomFetchOptions extends Omit<FetchOptions, 'method'> {
  method?: HTTPMethod
  _retry?: boolean
}

export default defineNuxtPlugin(() => {
  const { accessToken, refreshSession, logout } = useAuth()

  const rawApi = $fetch.create({
    onRequest({ options }) {
      if (accessToken.value) {
        options.headers = new Headers(options.headers || {})
        options.headers.set('Authorization', `Bearer ${accessToken.value}`)
      }
    },
  })

  const fetcher = rawApi as <R>(req: FetchRequest, opts?: Record<string, unknown>) => Promise<R>

  const api = async <T = unknown>(
    request: FetchRequest,
    options: CustomFetchOptions = {}
  ): Promise<T> => {
    const opts = options as Record<string, unknown>

    try {
      return await fetcher<T>(request, opts)
    } catch (error: unknown) {
      const fetchError = error as FetchError
      const status = fetchError?.status ?? fetchError?.response?.status
      const is401 = status === 401

      const requestUrl = typeof request === 'string'
        ? request
        : (typeof request === 'object' && request !== null && 'url' in request
            ? String((request as { url: unknown }).url)
            : String(request))

      const isRefreshUrl = requestUrl.includes('/api/auth/refresh')

      // 1. 401 sur la route refresh -> Déconnexion immédiate
      if (is401 && isRefreshUrl) {
        await logout()
        throw error
      }

      // 2. 401 classique -> Tentative de refresh
      if (is401 && !options._retry) {
        options._retry = true

        try {
          await refreshSession()
          return await fetcher<T>(request, opts)
        } catch (refreshError: unknown) {
          await logout()
          throw refreshError
        }
      }

      throw error
    }
  }

  return {
    provide: {
      api,
    },
  }
})