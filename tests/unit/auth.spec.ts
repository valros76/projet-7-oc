import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../../server/utils/auth'

describe('Auth Security Utils', () => {
  it('should hash a password and verify it successfully', async () => {
    const rawPassword = 'SuperSecurePassword123!'
    const hashed = await hashPassword(rawPassword)

    // Le mot de passe haché ne doit pas être en clair
    expect(hashed).not.toBe(rawPassword)

    // La vérification doit réussir avec le bon mot de passe
    const isValid = await verifyPassword(rawPassword, hashed)
    expect(isValid).toBe(true)
  })

  it('should fail verification on incorrect password', async () => {
    const rawPassword = 'SuperSecurePassword123!'
    const hashed = await hashPassword(rawPassword)

    // La vérification doit échouer avec un mauvais mot de passe
    const isValid = await verifyPassword('WrongPassword', hashed)
    expect(isValid).toBe(false)
  })
})