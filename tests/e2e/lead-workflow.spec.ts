import { test, expect } from '@playwright/test'

test.describe('Parcours de gestion des leads et Sécurité', () => {

  test("Redirection des utilisateurs non authentifiés vers la page de connexion", async ({ page }) => {
    // Tenter d'accéder à la page de création de lead sans être connecté
    await page.goto('/leads/new')
    
    // Doit être redirigé vers la page d'authentification
    await expect(page).toHaveURL('/')
  })

  test("Inscription, connexion et création d'un nouveau lead", async ({ page }) => {
    const uniqueEmail = `test.e2e.${Date.now()}@webdevoo.com`
    const password = 'Password123!'

    await page.goto('/')

    // -------------------------------------------------------------------------
    // 1. Inscription
    // -------------------------------------------------------------------------
    await page.getByRole('button', { name: 'Inscription' }).click()

    // SECURITÉ CI : S'assurer que le formulaire d'inscription est bien affiché avant de remplir
    const firstNameInput = page.locator('input[placeholder="Prénom"], input[name="firstName"]')
    await expect(firstNameInput).toBeVisible({ timeout: 10000 })

    await firstNameInput.fill('Jean')
    await page.fill('input[placeholder="Nom"], input[name="lastName"]', 'Dupont')
    await page.fill('input[placeholder="Téléphone"], input[name="phone"]', '0612345678')
    await page.fill('input[type="email"], input[name="email"]', uniqueEmail)
    await page.fill('input[type="password"], input[name="password"]', password)

    // Attendre la réponse API de l'inscription (200 ou 201)
    const registerResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/register') && [200, 201].includes(response.status())
    )

    await page.getByRole('button', { name: "S'inscrire" }).click()
    await registerResponsePromise

    // -------------------------------------------------------------------------
    // 2. Bascule vers la Connexion & Authentification
    // -------------------------------------------------------------------------
    await page.getByRole('button', { name: 'Connexion' }).click()

    // SECURITÉ CI : S'assurer que les champs de connexion sont visibles
    const loginEmailInput = page.locator('input[type="email"], input[name="email"]')
    await expect(loginEmailInput).toBeVisible({ timeout: 10000 })

    await loginEmailInput.fill(uniqueEmail)
    await page.fill('input[type="password"], input[name="password"]', password)

    const loginResponsePromise = page.waitForResponse(
      (response) => response.url().includes('/api/auth/login') && [200, 201].includes(response.status())
    )

    await page.getByRole('button', { name: 'Se connecter' }).click()
    await loginResponsePromise

    // -------------------------------------------------------------------------
    // 3. Redirection & Dashboard
    // -------------------------------------------------------------------------
    await page.waitForURL('**/leads/dashboard')
    await expect(page.getByRole('heading', { name: 'Tableau de bord' })).toBeVisible()

    // -------------------------------------------------------------------------
    // 4. Création d'un nouveau lead (Route : /leads/new)
    // -------------------------------------------------------------------------
    await page.click('a[href="/leads/new"]')
    await page.waitForURL('**/leads/new')

    // Remplissage avec les bons IDs du formulaire
    await page.fill('#companyName', 'Société Test E2E')
    await page.fill('#clientSiret', '12345678901234')
    await page.fill('#contactFirstName', 'Alice')
    await page.fill('#contactLastName', 'Martin')
    await page.fill('#clientEmail', 'alice.martin@test.com')
    await page.fill('#clientPhone', '0612345678')
    await page.fill('#missionTitle', 'Développement application mobile')
    await page.fill('#missionStartDate', '2026-09-01')

    // Attendre la réponse POST de la création API (200 ou 201)
    const createLeadPromise = page.waitForResponse(
      (response) => response.url().includes('/api/leads') && response.request().method() === 'POST' && [200, 201].includes(response.status())
    )

    await page.click('button[type="submit"]')
    await createLeadPromise

    // -------------------------------------------------------------------------
    // 5. Validation finale sur le dashboard
    // -------------------------------------------------------------------------
    await page.waitForURL('**/leads/dashboard')
    await expect(page.locator('text=Développement application mobile')).toBeVisible({ timeout: 15000 })
  })

  test("Déconnexion de l'utilisateur depuis le dashboard", async ({ page }) => {
    const uniqueEmail = `test.logout.${Date.now()}@webdevoo.com`
    const password = 'Password123!'

    // 1. Inscription rapide & Connexion pour arriver sur le dashboard
    await page.goto('/')
    await page.getByRole('button', { name: 'Inscription' }).click()
    
    const firstNameInput = page.locator('input[placeholder="Prénom"], input[name="firstName"]')
    await expect(firstNameInput).toBeVisible({ timeout: 10000 })

    await firstNameInput.fill('Paul')
    await page.fill('input[placeholder="Nom"], input[name="lastName"]', 'Emploi')
    await page.fill('input[placeholder="Téléphone"], input[name="phone"]', '0612345678')
    await page.fill('input[type="email"], input[name="email"]', uniqueEmail)
    await page.fill('input[type="password"], input[name="password"]', password)
    await page.getByRole('button', { name: "S'inscrire" }).click()

    await page.getByRole('button', { name: 'Connexion' }).click()
    
    const loginEmailInput = page.locator('input[type="email"], input[name="email"]')
    await expect(loginEmailInput).toBeVisible({ timeout: 10000 })

    await loginEmailInput.fill(uniqueEmail)
    await page.fill('input[type="password"], input[name="password"]', password)
    await page.getByRole('button', { name: 'Se connecter' }).click()

    // 2. Attente de l'arrivée sur le dashboard
    await page.waitForURL('**/leads/dashboard')

    // 3. Clic sur le bouton de déconnexion
    await page.locator('#main-navigation button.btn-logout').click()

    // 4. Vérification du retour sur la page d'accueil
    await page.waitForURL('/')
    await expect(page.getByRole('button', { name: 'Se connecter' })).toBeVisible()
  })
})