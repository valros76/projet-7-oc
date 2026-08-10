import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import type { FetchRequest, FetchOptions } from 'ofetch'

// -----------------------------------------------------------------------------
// Mock useAuth
// -----------------------------------------------------------------------------

const mockRefreshSession = vi.fn()
const mockLogout = vi.fn()
const mockAccessToken = ref<string | null>('valid_token')

const mockAuthReturn = {
  accessToken: mockAccessToken,
  refreshSession: mockRefreshSession,
  logout: mockLogout,
}

vi.mock('~/composables/auth/useAuth', () => ({
  useAuth: () => mockAuthReturn,
}))

// -----------------------------------------------------------------------------
// Mock Nuxt & $fetch avec capture de configuration
// -----------------------------------------------------------------------------

vi.stubGlobal('defineNuxtPlugin', (setup: unknown) => setup)

const mockRawApi = vi.fn()
let capturedFetchConfig: { onRequest?: (context: { options: FetchOptions }) => void } = {}

vi.stubGlobal('$fetch', {
  create: vi.fn((config) => {
    capturedFetchConfig = config
    return mockRawApi
  }),
})

// -----------------------------------------------------------------------------
// Types & Helpers
// -----------------------------------------------------------------------------

type ApiPluginFunction = <T = unknown>(
  request: FetchRequest,
  options?: FetchOptions & { _retry?: boolean }
) => Promise<T>

const create401Error = (message = 'Unauthorized') => {
  const error = new Error(message)
  Object.assign(error, {
    status: 401,
    statusCode: 401,
    response: { status: 401, _data: { message } },
  })
  return error
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe('Plugin API ($api)', () => {
  let apiPlugin: ApiPluginFunction

  beforeEach(async () => {
    vi.clearAllMocks()
    mockAccessToken.value = 'valid_token'

    const pluginModule = await import('~/plugins/api')
    const setupFn = pluginModule.default as () => {
      provide: { api: ApiPluginFunction }
    }

    const result = setupFn()
    apiPlugin = result.provide.api
  })

  // ---------------------------------------------------------------------------
  // Couverture onRequest (Lignes 18-20)
  // ---------------------------------------------------------------------------

  it('devrait ajouter le header Authorization dans onRequest si accessToken existe', () => {
    const options: FetchOptions = {}
    mockAccessToken.value = 'token_secret_123'

    capturedFetchConfig.onRequest?.({ options })

    const headers = options.headers as Headers
    expect(headers.get('Authorization')).toBe('Bearer token_secret_123')
  })

  it('ne devrait pas modifier les headers dans onRequest si accessToken est null', () => {
    const options: FetchOptions = {}
    mockAccessToken.value = null

    capturedFetchConfig.onRequest?.({ options })

    expect(options.headers).toBeUndefined()
  })

  // ---------------------------------------------------------------------------
  // Requetes classique (200 OK)
  // ---------------------------------------------------------------------------

  it('devrait effectuer une requête réussie du premier coup (200 OK)', async () => {
    const mockData = { success: true, leadId: 42 }
    mockRawApi.mockResolvedValueOnce(mockData)

    const response = await apiPlugin('/api/leads', {
      method: 'POST',
      body: { companyName: 'Test' },
    })

    expect(mockRawApi).toHaveBeenCalledTimes(1)
    expect(mockRefreshSession).not.toHaveBeenCalled()
    expect(mockLogout).not.toHaveBeenCalled()
    expect(response).toEqual(mockData)
  })

  // ---------------------------------------------------------------------------
  // Branches 401 -> refresh -> retry
  // ---------------------------------------------------------------------------

  it('devrait intercepter une 401, rafraîchir le token et retourner le résultat du re-try', async () => {
    const mockLeadSuccess = { success: true, leadId: 101 }
    const error401 = create401Error('Token expiré')

    mockRawApi.mockRejectedValueOnce(error401).mockResolvedValueOnce(mockLeadSuccess)

    mockRefreshSession.mockImplementationOnce(async () => {
      mockAccessToken.value = 'new_refreshed_token'
    })

    const response = await apiPlugin('/api/leads', { method: 'POST' })

    expect(mockRawApi).toHaveBeenCalledTimes(2)
    expect(mockRefreshSession).toHaveBeenCalledTimes(1)
    expect(mockLogout).not.toHaveBeenCalled()
    expect(response).toEqual(mockLeadSuccess)
  })

  it('devrait déconnecter l’utilisateur si le rafraîchissement de token échoue', async () => {
    const error401 = create401Error('Token expiré')
    const refreshError = new Error('Refresh token expiré')

    mockRawApi.mockRejectedValueOnce(error401)
    mockRefreshSession.mockRejectedValueOnce(refreshError)

    await expect(
      apiPlugin('/api/leads', { method: 'GET' })
    ).rejects.toThrow('Refresh token expiré')

    expect(mockRefreshSession).toHaveBeenCalledTimes(1)
    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockRawApi).toHaveBeenCalledTimes(1)
  })

  it('devrait déconnecter immédiatement si la route /api/auth/refresh renvoie 401', async () => {
    const error401 = create401Error('Unauthorized refresh')

    mockRawApi.mockRejectedValueOnce(error401)

    await expect(
      apiPlugin('/api/auth/refresh', { method: 'POST' })
    ).rejects.toThrow('Unauthorized refresh')

    expect(mockLogout).toHaveBeenCalledTimes(1)
    expect(mockRefreshSession).not.toHaveBeenCalled()
    expect(mockRawApi).toHaveBeenCalledTimes(1)
  })

  // ---------------------------------------------------------------------------
  // Branches d'erreur supplementaires (Ligne 67 + extraction d'URL)
  // ---------------------------------------------------------------------------

  it('devrait extraire l’URL si la requête est transmise sous forme d’objet', async () => {
    const error401 = create401Error('Unauthorized refresh')
    mockRawApi.mockRejectedValueOnce(error401)

    // Passage d'un objet { url: '...' } au lieu d'une string
    await expect(
      apiPlugin({ url: '/api/auth/refresh' } as unknown as FetchRequest, { method: 'POST' })
    ).rejects.toThrow('Unauthorized refresh')

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })

  it('devrait relancer immédiatement l’erreur si la réponse est un code 500 (non-401)', async () => {
    const error500 = new Error('Internal Server Error')
    Object.assign(error500, { status: 500 })

    mockRawApi.mockRejectedValueOnce(error500)

    await expect(apiPlugin('/api/leads', { method: 'GET' })).rejects.toThrow('Internal Server Error')

    expect(mockRefreshSession).not.toHaveBeenCalled()
    expect(mockLogout).not.toHaveBeenCalled()
  })

  it('ne devrait pas tenter de re-try si _retry est déjà égal à true', async () => {
    const error401 = create401Error('401 persistante')

    mockRawApi.mockRejectedValueOnce(error401)

    await expect(
      apiPlugin('/api/leads', { method: 'GET', _retry: true })
    ).rejects.toThrow('401 persistante')

    expect(mockRefreshSession).not.toHaveBeenCalled()
    expect(mockLogout).not.toHaveBeenCalled()
  })
})