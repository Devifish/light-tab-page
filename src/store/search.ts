import { createStore, Store } from "vuex"
import {
  SearchEngineData,
  OpenPageTarget,
  SearchSetting,
  SearchEngineItem,
  SearchSuggestion,
  HistoryItem,
  SearchData
} from "@/types"
import BaiduLogo from "@/assets/baidu.png"
import BingLogo from "@/assets/bing.svg"
import GoogleLogo from "@/assets/google.png"
import { copy, deepClone, isEmpty } from "@/utils/common"
import { InjectionKey } from "vue"
import { getBaiduSuggestion, getBingSuggestion, getGoogleSuggestion } from "@/api/suggestion"

interface SearchState {
  searchEngines: SearchEngineData
  setting: SearchSetting
  history: Array<HistoryItem>
}

const SEARCH_SETTING_STORAGE = "search-setting"
const SEARCH_ENGINES_STORAGE = "search-engines"
const SEARCH_HISTORY_STORAGE = "search-history"
const SEARCH_HISTORY_LENGTH = 100

export const DEFAULT_SEARCH_ENGINES: SearchEngineData = {
  baidu: {
    id: "baidu",
    name: "百度",
    description: "百度是中国使用群体最多的一款搜索引擎",
    icon: BaiduLogo,
    baseUrl: "https://www.baidu.com/#ie={inputEncoding}&wd={searchText}"
  },
  google: {
    id: "google",
    name: "Google",
    description: "Google搜索是全球公认为全球最大的搜索引擎",
    icon: GoogleLogo,
    baseUrl: "https://www.google.com/search?q={searchText}&ie={inputEncoding}"
  },
  bing: {
    id: "bing",
    name: "Bing",
    description: "必应是一款由微软公司推出的网络搜索引擎",
    icon: BingLogo,
    baseUrl: "https://cn.bing.com/search?q={searchText}"
  }
}

export const SEARCH_SETTING_KEY: InjectionKey<Store<SearchState>> = Symbol()
export default createStore<SearchState>({
  state() {
    const defaultState: SearchState = {
      searchEngines: { ...DEFAULT_SEARCH_ENGINES },
      setting: {
        currentEngine: "bing",
        openPageTarget: OpenPageTarget.Blank,
        showEngineSelect: true,
        searchInputRadius: 4,
        useSearchEngines: Object.keys(DEFAULT_SEARCH_ENGINES),
        suggestion: SearchSuggestion.none
      },
      history: []
    }

    const searchSetting = JSON.parse(localStorage[SEARCH_SETTING_STORAGE] ?? "{}")
    copy(searchSetting, defaultState.setting, true)

    const searchEngines = JSON.parse(localStorage[SEARCH_ENGINES_STORAGE] ?? "{}")
    Object.assign(defaultState.searchEngines, searchEngines)

    const history = JSON.parse(localStorage[SEARCH_HISTORY_STORAGE] ?? "[]")
    if (!isEmpty(history)) defaultState.history = history

    return defaultState
  },
  getters: {
    getUseSearchEngines({ searchEngines, setting }) {
      const useSearchEngines = setting.useSearchEngines!
      const temp: SearchEngineData = {}

      for (let id of useSearchEngines) {
        const searchEngine = searchEngines[id]
        if (isEmpty(searchEngine)) continue

        temp[id] = searchEngine
      }
      return temp
    }
  },
  mutations: {
    putHistory({ history }, newHistory: HistoryItem) {
      history.unshift(newHistory)
      saveSearchHistory(history)
    },
    deleteHistory({ history }, index: number) {
      history.splice(index, 1)

      saveSearchHistory(history)
    },
    cleanHistory(state) {
      state.history = []
      localStorage.removeItem(SEARCH_HISTORY_STORAGE)
    },
    updateCurrentEngine(state, currentEngine: string) {
      if (isEmpty(state.searchEngines[currentEngine])) return

      state.setting.currentEngine = currentEngine
      saveSettingState(state.setting)
    },
    updateSearchSetting(state, setting: SearchSetting) {
      copy(setting, state.setting)
      saveSettingState(state.setting)
    },
    addSearchEngine(state, data: SearchEngineItem) {
      const searchEnginesNew = {
        ...state.searchEngines,
        [data.id]: data
      }

      state.searchEngines = searchEnginesNew
      saveSearchEngineData(searchEnginesNew)
    },
    deleteSearchEngine(state, searchKey: string) {
      const searchEnginesNew = deepClone(state.searchEngines, searchKey)

      state.searchEngines = searchEnginesNew
      saveSearchEngineData(searchEnginesNew)
    }
  },
  actions: {
    submitSearch({ state, commit, dispatch }, searchText: string) {
      const { setting } = state
      const currentEngine = setting.currentEngine!
      const history: HistoryItem = {
        searchText,
        engineId: currentEngine,
        timestamp: Date.now()
      }

      commit("putHistory", history)
      dispatch("openSearchPage", <SearchData>{
        engine: currentEngine,
        text: searchText,
        target: setting.openPageTarget
      })
    },

    openSearchPage({ state }, search: SearchData) {
      const { searchEngines } = state

      // 构建搜索URL
      let url = searchEngines[search.engine].baseUrl
      if (url.includes("{searchText}")) url = url.replace("{searchText}", encodeURI(search.text))
      if (url.includes("{inputEncoding}")) url = url.replace("{inputEncoding}", "utf-8")

      window.open(url, search.target)
    },

    getSuggestion({ state }, searchText: string) {
      const { setting } = state

      switch (setting.suggestion) {
        case SearchSuggestion.baidu:
          return getBaiduSuggestion(searchText)
        case SearchSuggestion.bing:
          return getBingSuggestion(searchText)
        case SearchSuggestion.google:
          return getGoogleSuggestion(searchText)
        default:
          return []
      }
    }
  }
})

function saveSettingState(data: SearchSetting) {
  const settingJson = JSON.stringify(data)
  localStorage.setItem(SEARCH_SETTING_STORAGE, settingJson)
}

function saveSearchEngineData(data: SearchEngineData) {
  const saveData = deepClone(data, ...Object.keys(DEFAULT_SEARCH_ENGINES))
  const dataJson = JSON.stringify(saveData)
  localStorage.setItem(SEARCH_ENGINES_STORAGE, dataJson)
}

function saveSearchHistory(data: Array<HistoryItem>) {
  const length = data.length
  if (length > SEARCH_HISTORY_LENGTH) {
    data.splice(SEARCH_HISTORY_LENGTH - 1, length - SEARCH_HISTORY_LENGTH)
  }

  const dataJson = JSON.stringify(data)
  localStorage.setItem(SEARCH_HISTORY_STORAGE, dataJson)
}
