import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import ViteComponents, { AntDesignVueResolver } from "vite-plugin-components";
//const { getThemeVariables } = require('ant-design-vue/dist/theme');

export default defineConfig({
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "src")}/`,
      "@views/": `${resolve(__dirname, "src", "views")}/`,
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [
    vue(),
    ViteComponents({
      globalComponentsDeclaration: true,
      customComponentResolvers: [
        AntDesignVueResolver({
          importLess: true,
        }),
      ],
    }),
  ],
});
