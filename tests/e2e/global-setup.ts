import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'

export default async function globalSetup() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootpassword',
    database: 'webdevoo_lead',
  })

  try {
    const email = 'apporteur@webdevoo.com'
    
    // 1. Supprimer l'utilisateur s'il existe déjà pour éviter le conflit 409
    await connection.execute('DELETE FROM users WHERE email = ?', [email])

    // 2. Hacher le mot de passe
    const hashedPassword = await bcrypt.hash('password123', 10)

    // 3. Le recréer proprement à chaque lancement de test
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