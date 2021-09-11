import type { App, InjectionKey } from "vue"
import { createStore, useStore as baseUseStore, Module, Store, GetterTree, Getter } from "vuex"
import search, { SearchState } from "./search"
import setting, { SettingState } from "./setting"
import topSite, { TopSiteState } from "./top-site"

export type RootState = {
  search: SearchState
  setting: SettingState
  topSite: TopSiteState
}

export const STORE_KEY: InjectionKey<Store<RootState>> = Symbol("store_key")

export function createStoreModule<S>(module: Module<S, RootState>) {
  return module
}

export function useStore() {
  return baseUseStore(STORE_KEY)
}

const store = createStore<RootState>({
  modules: {
    search,
    setting,
    topSite
  }
})

export default {
  install(app: App) {
    app.use(store, STORE_KEY)
  }
}
