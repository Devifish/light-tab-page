import { App } from "vue";
import SearchStore, { SEARCH_SETTING_KEY } from "./search";
import SettingStore, { SETTING_STORE_KEY } from "./setting";

export default {
  install(app: App) {
    app.use(SearchStore, SEARCH_SETTING_KEY);
    app.use(SettingStore, SETTING_STORE_KEY);
  },
};
