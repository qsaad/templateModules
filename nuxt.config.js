import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    //titleTemplate: '%s - ' + process.env.npm_package_name,
    title: 'Rapid Lyst',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Quick to-do list web application' },
      { name: 'theme-color', content: 'white' },
      { name: 'msapplication-TileColor', content: '#ffffff"' },
      { name: "msapplication-TileImage", content:"icons/ms-icon-144x144.png"},
      //IOS META DATA (ALLOWS FULL SCREEN MODE)
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: "apple-mobile-web-app-statusbar-style", content: 'black' },
      { name: "apple-mobile-web-app-title", content: 'Rapid Lyst' },
      { name: 'mobile-web-app-capable', content: 'yes' },
    ],
    script: [
      //{ src: 'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyC68j8B3fHDgycCQLAJB0MXh872mKqGJho'},
      //{ src: 'sweetalert2/dist/sweetalert2.min.js'}
    ],
    link: [
      //{ rel: 'stylesheet', href: '@sweetalert2/themes/dark/dark.css' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      //MANIFEST FILE
      { rel: 'manifest', href: '/manifest.json' },

      { rel:"apple-touch-icon", sizes:"180x180", href:"icons/apple/apple-icon-180.png"},
      { rel:"apple-touch-icon", sizes:"167x167", href:"icons/apple/apple-icon-167.png"},
      { rel:"apple-touch-icon", sizes:"152x152", href:"icons/apple/apple-icon-152.png"},
      { rel:"apple-touch-icon", sizes:"120x120", href:"icons/apple/apple-icon-120.png"},

      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-2048-2732.png", media:"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-2732-2048.png", media:"(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-1668-2388.png", media:"(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-2388-1668.png", media:"(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-1668-2224.png", media:"(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-2224-1668.png", media:"(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-1536-2048.png", media:"(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-2048-1536.png", media:"(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-1242-2688.png", media:"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-2688-1242.png", media:"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-1125-2436.png", media:"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-2436-1125.png", media:"(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-828-1792.png", media:"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-1792-828.png", media:"(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-1242-2208.png", media:"(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-2208-1242.png", media:"(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-750-1334.png", media:"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-1334-750.png", media:"(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-640-1136.png", media:"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"},
      { rel:"apple-touch-startup-image", href:"icons/apple/apple-splash-1136-640.png", media:"(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"}
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  // manifest: {
  //   name: "Rapid Lyst",
  //   short_name: "Raptor",
  //   lang: "en-US",
  //   start_url: "/index.html",
  //   display: "standalone",
  //   background_color: "#fff",
  //   theme_color: "#fff",
  //   description: "Quick to-do list webapp",
  //   icons: [
  //     { src: "icon.png", sizes: "48x48", type: "image/png" },
  //     { src: "images/icon-512.png",sizes: "512x512",type: "image/png" }
  //   ],
  // },
  plugins: [
    '~/plugins/firebase.js',
    //'~/plugins/fireauth.js',
    '~/plugins/vue-touch.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    //'@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
  ],
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    //analyze: true,
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
