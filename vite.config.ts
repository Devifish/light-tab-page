import { defineConfig } from "vite"
import { resolve, extname } from "path"
import vue from "@vitejs/plugin-vue"
import { viteBuildManifest } from "./script/build-manifest"
import ViteComponents from "unplugin-vue-components/vite"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
import vueI18n from "@intlify/vite-plugin-vue-i18n"

export default defineConfig(env => ({
  envPrefix: ["APP_", "npm_package_name", "npm_package_version"],
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "src")}/`
    }
  },
  build: {
    minify: env.mode !== "development",
    brotliSize: false,
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      output: {
        manualChunks: getManualChunks({
          "ant-design": ["ant-design-vue", "@ant-design/icons-vue"]
        }),
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: info =>
          extname(info.name) === ".css"
            ? "css/[name]-[hash][extname]"
            : "assets/[name]-[hash][extname]"
      }
    }
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
    vueI18n({
      include: resolve(__dirname, "src/locales/**"),
      compositionOnly: true
    }),
    ViteComponents({
      dts: true,
      resolvers: [
        AntDesignVueResolver({
          importLess: true
        })
      ]
    }),
    viteBuildManifest()
  ]
}))

function getManualChunks(data: Record<string, string[]>) {
  return (id: string) => {
    if (!id.includes("node_modules")) return undefined

    const temp = id.split("node_modules/")
    const relativePath = temp[temp.length - 1] // 兼容pnpm
    for (let key in data) {
      for (let lib of data[key]) {
        if (relativePath.startsWith(`${lib}/`)) {
          return key
        }
      }
    }
    return "vendor"
  }
}
