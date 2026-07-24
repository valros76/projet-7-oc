import { resolve } from "node:path";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  alias: {
    '@server': resolve(__dirname, './server'),
  },
  runtimeConfig: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'fallback_webdevoo_acc_key@12',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback_webdevoo_rfsh_sec@12',
  },
  imports: {
    dirs: [
      "composables",
      "composables/**"
    ]
  },
  css: ['~/assets/css/init.css']
})
