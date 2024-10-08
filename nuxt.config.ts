// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  ssr: false,
  devtools: { enabled: false },
  modules: [
    "@vueuse/nuxt",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxt/image",
    "@nuxtjs/google-fonts",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/icon",
    // "@sidebase/nuxt-auth",
    "nuxt-emoji-picker",
  ],
  // auth: {
  //   baseURL: 'api/auth',
  //   provider: {
  //     type: "local",
  //     endpoints: {
  //       signIn: { path: '/login', method: 'post' },
  //       signOut: { path: '/logout', method: 'post' },
  //       // signUp: { path: '/register', method: 'post' },
  //       getSession: { path: '/session', method: 'get' },
  //     },
  //     token: {
  //       signInResponseTokenPointer: '/token/accessToken'
  //     },
  //     session: {
  //       dataType: {
  //         id: 'string',
  //         name: 'string',
  //         email: 'string',
  //       },
  //     },
  //   },
  //   globalAppMiddleware: true,
  // },
  nitro: {
    experimental: {
      websocket: true,
    },
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  image: {
    quality: 80,
    format: ["webp"],
  },
  googleFonts: {
    families: {
      Raleway: {
        wght: [100, 400],
        ital: [100],
      },
    },
  },
  colorMode: {
    preference: "system", // default value of $colorMode.preference
    fallback: "light", // fallback value if not system preference found
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    classSuffix: "",
    storageKey: "nuxt-color-mode-admin",
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: "strict",
    },
  },
});
