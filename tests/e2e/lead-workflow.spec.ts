import { test, expect } from '@playwright/test'

test.describe('Parcours de gestion des leads', () => {
  test("Inscription, connexion et création d'un nouveau lead", async ({ page }) => {
    // Email unique à chaque exécution pour éviter l'erreur "Utilisateur existe déjà"
    const uniqueEmail = `test.e2e.${Date.now()}@webdevoo.com`
    const password = 'Password123!'

    await page.goto('/')

    // -------------------------------------------------------------------------
    // 1. Inscription
    // -------------------------------------------------------------------------
    await page.getByRole('button', { name: 'Inscription' }).click()

    await page.fill('input[placeholder="Prénom"], input[name="firstName"]', 'Jean')
    await page.fill('input[placeholder="Nom"], input[name="lastName"]', 'Dupont')
    await page.fill('input[placeholder="Téléphone"], input[name="phone"]', '0612345678')
    await page.fill('input[type="email"], input[name="email"]', uniqueEmail)
    await page.fill('input[type="password"], input[name="password"]', password)

    // Attendre la réponse API de l'inscription
    const registerResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/register') && response.status() === 200
    )

    await page.getByRole('button', { name: "S'inscrire" }).click()
    await registerResponsePromise

    // -------------------------------------------------------------------------
    // 2. Bascule vers la Connexion & Authentification
    // -------------------------------------------------------------------------
    // Rebasculer sur l'onglet Connexion après l'inscription réussie
    await page.getByRole('button', { name: 'Connexion' }).click()

    await page.fill('input[type="email"], input[name="email"]', uniqueEmail)
    await page.fill('input[type="password"], input[name="password"]', password)

    const loginResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/login') && response.status() === 200
    )

    await page.getByRole('button', { name: 'Se connecter' }).click()
    await loginResponsePromise

    // -------------------------------------------------------------------------
    // 3. Redirection & Dashboard
    // -------------------------------------------------------------------------
    await page.waitForURL('**/leads/dashboard')
    await expect(page.locator('h1')).toContainText('Tableau de bord - Apporteur')

    // -------------------------------------------------------------------------
    // 4. Création d'un nouveau lead
    // -------------------------------------------------------------------------
    await page.click('a:has-text("+ Nouveau Lead")')
    await page.waitForURL('**/leads/new')

    // Remplissage avec les bons IDs du composant Vue
    await page.fill('#companyName', 'Société Test E2E')
    await page.fill('#clientSiret', '12345678901234')
    await page.fill('#contactFirstName', 'Alice')
    await page.fill('#contactLastName', 'Martin')
    await page.fill('#clientEmail', 'alice.martin@test.com') // Corrigé : #clientEmail au lieu de #contactEmail
    await page.fill('#clientPhone', '0612345678')
    await page.fill('#missionTitle', 'Développement application mobile')
    await page.fill('#missionStartDate', '2026-09-01')

    // Attendre la réponse de la création API
    const createLeadPromise = page.waitForResponse(
      (response) => response.url().includes('/api/leads') && response.status() === 200
    )

    await page.click('button[type="submit"]')
    await createLeadPromise

    // -------------------------------------------------------------------------
    // 5. Validation finale sur le dashboard
    // -------------------------------------------------------------------------
    await page.waitForURL('**/leads/dashboard')
    await expect(page.locator('text=Société Test E2E')).toBeVisible()
  })
})