import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import ViteComponents, { AntDesignVueResolver } from "vite-plugin-components";

export default defineConfig({
  resolve: {
    alias: {
      "@/": `${resolve(__dirname, "src")}/`,
      "@views/": `${resolve(__dirname, "src", "views")}/`,
    },
  },
  plugins: [
    vue(),
    ViteComponents({
      globalComponentsDeclaration: true,
      customComponentResolvers: [AntDesignVueResolver()],
    }),
  ],
});
