import { test, expect } from '@playwright/test'

test.describe('Parcours de gestion des leads', () => {
  test('Connexion puis création réussie d\'un nouveau lead', async ({ page }) => {
    // 1. Aller sur la page de connexion
    await page.goto('/')

    // 2. Se connecter (adapter les sélecteurs selon votre composant LoginForm)
    await page.fill('input[type="email"]', 'apporteur@webdevoo.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')

    // 3. Vérifier l'arrivée sur le dashboard
    await page.waitForURL('/leads/dashboard')
    await expect(page.locator('h1')).toContainText('Tableau de bord')

    // 4. Cliquer sur le bouton de création de lead
    await page.click('text=+ Nouveau Lead')
    await page.waitForURL('/leads/new')

    // 5. Remplir le formulaire
    await page.fill('#companyName', 'Société Test E2E')
    await page.fill('#contactFirstName', 'Alice')
    await page.fill('#contactLastName', 'Martin')
    await page.fill('#contactEmail', 'alice.martin@test.com')
    await page.fill('#missionTitle', 'Développement application mobile')
    await page.fill('#missionStartDate', '2026-09-01')

    // 6. Soumettre le formulaire
    await page.click('button[type="submit"]')

    // 7. Vérifier la redirection vers le dashboard et la présence du lead
    await page.waitForURL('/leads/dashboard')
    await expect(page.locator('text=Société Test E2E')).toBeVisible()
  })
})