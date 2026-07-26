import { userRepository } from '@server/repositories/userRepository'
import { hashPassword } from '@server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password, firstName, lastName, phone } = body

  if (!email || !password || !firstName || !lastName || !phone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tous les champs obligatoires (email, mot de passe, prénom, nom, téléphone) doivent être remplis.',
    })
  }

  const existingUser = await userRepository.findByEmail(email)
  if (existingUser) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Un compte avec cet email existe déjà.',
    })
  }

  const hashedPassword = await hashPassword(password)

  const userId = await userRepository.createUser({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    phone,
    role: 'referrer',
  })

  return {
    success: true,
    message: 'Utilisateur créé avec succès.',
    userId,
  }
})