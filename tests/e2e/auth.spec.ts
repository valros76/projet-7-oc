import { test, expect } from '@playwright/test'

test('user can switch between login and register views', async ({ page }) => {
  await page.goto('/')

  // 1. Par défaut, le formulaire de connexion doit être visible (bouton onglet Connexion actif)
  const loginTab = page.locator('button.tab-btn', { hasText: 'Connexion' })
  await expect(loginTab).toBeVisible()

  // 2. Cliquer explicitement sur l'onglet "Inscription"
  const registerTab = page.locator('button.tab-btn', { hasText: 'Inscription' })
  await registerTab.click()

  // 3. Attendre et vérifier que les champs spécifiques à l'inscription s'affichent
  const firstNameInput = page.locator('input[placeholder="Prénom"]')
  await expect(firstNameInput).toBeVisible()
  
  await expect(page.locator('input[placeholder="Nom"]')).toBeVisible()
  await expect(page.locator('input[placeholder="Téléphone"]')).toBeVisible()
})