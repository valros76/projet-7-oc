import { test, expect } from '@playwright/test'

test.describe('Parcours de gestion des leads', () => {
  test('Création réussie d\'un nouveau lead avec session pré-établie', async ({ page, context }) => {
    // 1. Injecter directement le cookie de rafraîchissement dans le navigateur de test
    // (Assurez-vous que la valeur correspond à ce que votre serveur attend, ou simulez une session)
    await context.addCookies([
      {
        name: 'refresh_token',
        value: 'votre_token_de_test_valide_ou_mock',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false, // Doit être false en HTTP local
        sameSite: 'Lax',
      }
    ])

    // 2. Aller sur l'accueil ou directement sur le dashboard
    await page.goto('/leads/dashboard')

    // 3. Vérifier l'arrivée sur le tableau de bord
    await expect(page.locator('h1')).toContainText('Tableau de bord - Apporteur')

    // 4. Cliquer sur le bouton de création de lead
    await page.click('a:has-text("+ Nouveau Lead")')
    await page.waitForURL('**/leads/new')

    // 5. Remplir le formulaire de création de lead
    await page.fill('input[name="companyName"], #companyName', 'Société Test E2E')
    await page.fill('input[name="contactFirstName"], #contactFirstName', 'Alice')
    await page.fill('input[name="contactLastName"], #contactLastName', 'Martin')
    await page.fill('input[name="contactEmail"], #contactEmail', 'alice.martin@test.com')
    await page.fill('input[name="missionTitle"], #missionTitle', 'Développement application mobile')
    await page.fill('input[name="missionStartDate"], #missionStartDate', '2026-09-01')

    // 6. Soumettre le formulaire
    await page.click('form button[type="submit"]')

    // 7. Vérifier le retour sur le dashboard et la présence du lead
    await page.waitForURL('**/leads/dashboard')
    await expect(page.locator('text=Société Test E2E')).toBeVisible()
  })
})