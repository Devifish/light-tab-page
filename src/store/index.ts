import type { App, Plugin } from "vue"
import { createPinia } from "pinia"
import useSearchStore from "./search"
import useSettingStore from "./setting"
import useTopSiteStore from "./top-site"

const pinia = createPinia()
const definePlugin: Plugin = {
  install(app: App) {
    app.use(pinia)
  }
}

export default definePlugin
export { useSettingStore, useSearchStore, useTopSiteStore }
