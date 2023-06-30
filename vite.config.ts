import { defineConfig } from "vite"
import { resolve, extname } from "path"
import vue from "@vitejs/plugin-vue"
import { viteBuildManifest } from "./script/build-manifest"
import ViteComponents from "unplugin-vue-components/vite"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite"
import manifest from "./manifest.config"

export default defineConfig(({ mode }) => {
  const isDevMode = mode === "development"

  return {
    envPrefix: ["APP_", "npm_package_name", "npm_package_version"],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src")
      }
    },
    build: {
      minify: !isDevMode,
      sourcemap: isDevMode,
      chunkSizeWarningLimit: 1024,
      rollupOptions: {
        output: {
          manualChunks: {
            "ant-design": ["ant-design-vue", "@ant-design/icons-vue"]
          },
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: info =>
            extname(info.name!) === ".css"
              ? "css/[name]-[hash][extname]"
              : "assets/[name]-[hash][extname]"
        }
      }
    },
    plugins: [
      vue(),
      VueI18nPlugin({
        include: resolve(__dirname, "src/locales/**"),
        compositionOnly: true
      }),
      ViteComponents({
        dts: true,
        resolvers: [
          AntDesignVueResolver({
            importStyle: false
          })
        ]
      }),
      viteBuildManifest(manifest)
    ]
  }
})
