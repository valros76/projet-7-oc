export default defineNuxtPlugin(async () => {
  const { accessToken, refreshSession } = useAuth()

  // Si on n'a pas d'access token en mémoire (ex: après un F5), 
  // on tente de rafraîchir la session via le cookie HttpOnly
  if (!accessToken.value) {
    try {
      await refreshSession()
    } catch {
      // L'utilisateur n'a pas de session valide, on ne fait rien (il reste invité)
    }
  }
})