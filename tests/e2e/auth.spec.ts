import { test, expect } from '@playwright/test'

test('user can switch between login and register views', async ({ page }) => {
  await page.goto('/')

  // Par défaut, le formulaire de connexion doit être visible
  await expect(page.locator('button:has-text("Se connecter")')).toBeVisible()

  // Cliquer sur le bouton pour basculer vers l'inscription
  await page.click('button:has-text("Inscription")')

  // Vérifier que les champs spécifiques à l'inscription s'affichent correctement
  await expect(page.locator('input[placeholder="Prénom"]')).toBeVisible()
  await expect(page.locator('input[placeholder="Nom"]')).toBeVisible()
  await expect(page.locator('input[placeholder="Téléphone"]')).toBeVisible()
})