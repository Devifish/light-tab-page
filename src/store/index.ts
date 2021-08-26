import { createStore, createLogger, Plugin } from "vuex";
import SearchModule from "./search";
import SettingModule from "./setting";

const plugins: Plugin<any>[] = [];

// 非生产环境添加日志
if (import.meta.env.DEV) {
  plugins.push(createLogger());
}

export default createStore({
  modules: {
    search: SearchModule,
    setting: SettingModule,
  },
  plugins,
});
