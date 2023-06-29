import type { App, Plugin } from "vue"
import { createPinia } from "pinia"
import { createPersistedState } from "pinia-plugin-persistedstate"
import useSearchStore from "./search"
import useSettingStore from "./setting"
import useTopSiteStore from "./top-site"

const pinia = createPinia()
const persistedState = createPersistedState({
  key: storeKey => `${storeKey}-data`,
  auto: true
})

// 注册插件
pinia.use(persistedState)

const definePlugin: Plugin = {
  install(app: App) {
    app.use(pinia)
  }
}

export default definePlugin
export { useSettingStore, useSearchStore, useTopSiteStore }
