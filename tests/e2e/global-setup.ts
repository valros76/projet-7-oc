import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

export default async function globalSetup() {
  const maxRetries = 15
  const delay = 2000 // 2 secondes d'attente entre chaque essai
  let connection: mysql.Connection | null = null

  // 1. Boucle de sécurité pour attendre que MySQL soit prêt à accepter les connexions
  for (let i = 0; i < maxRetries; i++) {
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'rootpassword',
        database: process.env.DB_NAME || 'webdevoo_lead',
      })
      break
    } catch (error) {
      if (i === maxRetries - 1) {
        console.error("❌ Impossible de se connecter à la base de données après plusieurs tentatives.")
        throw error
      }
      console.log(`🔄 [GlobalSetup] En attente de MySQL (${i + 1}/${maxRetries})...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  if (connection) {
    try {
      const email = 'apporteur@webdevoo.com'
      
      // 2. Supprimer l'utilisateur s'il existe déjà pour éviter le conflit 409
      await connection.execute('DELETE FROM users WHERE email = ?', [email])

      // 3. Hacher le mot de passe
      const hashedPassword = await bcrypt.hash('password123', 10)

      // 4. Le recréer proprement à chaque lancement de test
      await connection.execute(
        `INSERT INTO users (role, first_name, last_name, email, password, phone) 
         VALUES ('referrer', 'Jean', 'Testeur', ?, ?, '0601020304')`,
        [email, hashedPassword]
      )
      
      console.log('🔄 Utilisateur de test réinitialisé avec succès en base.')
    } finally {
      await connection.end()
    }
  }
}