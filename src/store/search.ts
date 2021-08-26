import { Module } from "vuex";
import { SearchEngineData, OpenPageTarget, SearchSetting } from "@/types";
import BaiduLogo from "@/assets/baidu.png";
import BingLogo from "@/assets/bing.svg";
import GoogleLogo from "@/assets/google.png";
import { copy, isEmpty } from "@/utils/common";

interface SearchState {
  searchEngines: SearchEngineData;
  setting: SearchSetting;
  history: Array<string>;
}

const SEARCH_SETTING_STORAGE = "search-setting";
const DEFAULT_SEARCH_ENGINES: SearchEngineData = {
  baidu: {
    name: "百度",
    icon: BaiduLogo,
    baseUrl: "https://www.baidu.com/#ie={inputEncoding}&wd={searchText}",
  },
  bing: {
    name: "Bing",
    icon: BingLogo,
    baseUrl: "https://cn.bing.com/search?q={searchText}",
  },
  google: {
    name: "Google",
    icon: GoogleLogo,
    baseUrl: "https://www.google.com/search?q={searchText}&ie={inputEncoding}",
  },
};

const searchModule: Module<SearchState, any> = {
  namespaced: true,
  state() {
    const defaultState: SearchState = {
      searchEngines: DEFAULT_SEARCH_ENGINES,
      setting: {
        currentEngine: "bing",
        openPageTarget: OpenPageTarget.Blank,
        showEngineSelect: true,
        searchInputRadius: 4
      },
      history: [],
    };

    const searchSetting = JSON.parse(
      localStorage[SEARCH_SETTING_STORAGE] ?? "{}"
    );
    copy(searchSetting, defaultState.setting, true);

    const history = JSON.parse(localStorage["history"] ?? "[]");
    if (!isEmpty(history)) defaultState.history = history;

    return defaultState;
  },
  getters: {
    getCurrentEngine(state) {
      return state.setting.currentEngine;
    },
    getSearchEngines(state) {
      return state.searchEngines;
    },
    getSearchSetting(state) {
      return state.setting;
    },
    getHistory(state) {
      return state.history;
    },
  },
  mutations: {
    putHistory(state, newHistory: string) {
      console.log("写入搜索历史", newHistory);
    },
    updateCurrentEngine(state, currentEngine: string) {
      if (isEmpty(state.searchEngines[currentEngine])) return;

      state.setting.currentEngine = currentEngine;
      saveSettingState(state.setting);
    },
    updateSearchSetting(state, setting: SearchSetting) {
      copy(setting, state.setting, true, true);
      saveSettingState(state.setting);
    },
  },
  actions: {
    submitSearch({ state, commit }, searchText: string) {
      const { searchEngines, setting } = state;
      const currentEngine = setting.currentEngine!;

      let url = searchEngines[currentEngine].baseUrl;
      url = url.replace("{searchText}", encodeURI(searchText));

      // inputEncoding
      if (url.includes("{inputEncoding}"))
        url = url.replace("{inputEncoding}", "utf-8");

      commit("putHistory", searchText);
      window.open(url, setting.openPageTarget);
    },
  },
};

function saveSettingState(data: SearchSetting) {
  const settingJson = JSON.stringify(data);
  localStorage.setItem(SEARCH_SETTING_STORAGE, settingJson);
}

export default searchModule;
