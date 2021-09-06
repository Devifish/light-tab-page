import { defineConfig } from "vite"
import { resolve } from "path"
import vue from "@vitejs/plugin-vue"
import ViteComponents, { AntDesignVueResolver } from "vite-plugin-components"

export default defineConfig({
  envPrefix: "APP_",
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "src")}/`
    }
  },
  build: {
    brotliSize: false,
    chunkSizeWarningLimit: 1024
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "border-radius-base": "4px"
        },
        javascriptEnabled: true
      }
    }
  },
  plugins: [
    vue(),
    ViteComponents({
      globalComponentsDeclaration: true,
      customComponentResolvers: [
        AntDesignVueResolver({
          importLess: true
        })
      ]
    })
  ]
})
