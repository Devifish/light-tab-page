import { App } from "vue"
import SearchStore, { SEARCH_SETTING_KEY } from "./search"
import SettingStore, { SETTING_STORE_KEY } from "./setting"
import TopSiteStore, { TOP_SITE_STORE_KEY } from "./top-site"

export default {
  install(app: App) {
    app.use(SearchStore, SEARCH_SETTING_KEY)
    app.use(SettingStore, SETTING_STORE_KEY)
    app.use(TopSiteStore, TOP_SITE_STORE_KEY)
  }
}
