// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "Crud | Nuxt",
      script: [{ src: "https://cdn.jsdelivr.net/npm/sweetalert2@11", defer: true }],
    },
  },

  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  css: ["./assets/css/main.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
