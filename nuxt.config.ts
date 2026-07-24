// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  imports: {
    dirs: [
      "composables",
      "composables/**"
    ]
  },
  css: ['~/assets/css/init.css']
})
