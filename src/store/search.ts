import { Module } from "vuex";
import { SearchEngineData } from "@/types";
import BaiduLogo from "@/assets/baidu.png";
import BingLogo from "@/assets/bing.svg";
import { isEmpty } from "@/utils/common";

interface SearchState {
  searchEngines: SearchEngineData;
  currentEngine: string;
  history: Array<string>;
}

export enum OpenPageTarget {
  BLANK = "_blank",
  SELF = "_self"
}

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
};

const currentEngine = localStorage["currentEngine"] ?? "bing";
const history = JSON.parse(localStorage["history"] ?? "[]");

const searchModule: Module<SearchState, any> = {
  namespaced: true,
  state: {
    searchEngines: {
      ...DEFAULT_SEARCH_ENGINES,
    },
    currentEngine,
    history,
  },
  getters: {
    getCurrentEngine(state) {
      return state.currentEngine;
    },
    getSearchEngines(state) {
      return state.searchEngines;
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

      state.currentEngine = currentEngine;
      localStorage.setItem("currentEngine", currentEngine);
    },
  },
  actions: {
    submitSearch({ state, commit }, searchText: string) {
      const { searchEngines, currentEngine } = state;
      commit("putHistory", searchText);

      let url = searchEngines[currentEngine].baseUrl;
      url = url.replace("{searchText}", encodeURI(searchText));

      // inputEncoding
      if (url.includes("{inputEncoding}"))
        url = url.replace("{inputEncoding}", "utf-8");

      window.open(url, OpenPageTarget.BLANK);
    },
  },
};

export default searchModule;
