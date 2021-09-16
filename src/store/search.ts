import { createStoreModule } from "./index"
import {
  SearchEngineData,
  SearchEngineItem,
  SearchSuggestion,
  HistoryItem,
  SearchData
} from "@/types"
import BaiduLogo from "@/assets/baidu.png"
import BingLogo from "@/assets/bing.svg"
import GoogleLogo from "@/assets/google.png"
import { deepClone, isEmpty } from "@/utils/common"
import { getBaiduSuggestion, getBingSuggestion, getGoogleSuggestion } from "@/api/suggestion"

export interface SearchState {
  searchEngines: SearchEngineData
  history: Array<HistoryItem>
}

export enum SearchGetters {
  getUseSearchEngines = "GET_USE_SEARCH_ENGINES"
}

export enum SearchMutations {
  putHistory = "PUT_HISTORY",
  deleteHistory = "DELETE_HISTORY",
  cleanHistory = "CLEAN_HISTORY",
  loadHistory = "LOAD_HISTORY",
  addSearchEngine = "ADD_SEARCH_ENGINE",
  deleteSearchEngine = "DELETE_SEARCH_ENGINE"
}

export enum SearchActions {
  submitSearch = "SUBMIT_SEARCH",
  openSearchPage = "OPEN_SEARCH_PAGE",
  getSuggestion = "GET_SUGGESTION"
}

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

export default createStoreModule<SearchState>({
  state() {
    const defaultState: SearchState = {
      searchEngines: { ...DEFAULT_SEARCH_ENGINES },
      history: []
    }

    const searchEngines = JSON.parse(localStorage[SEARCH_ENGINES_STORAGE] ?? "{}")
    Object.assign(defaultState.searchEngines, searchEngines)

    return defaultState
  },
  getters: {
    /**
     * 获取需要使用的搜索引擎列表
     * @param param0
     * @returns
     */
    [SearchGetters.getUseSearchEngines]: ({ searchEngines }, _, rootState) => {
      const setting = rootState.setting.search,
        useSearchEngines = setting.useSearchEngines!,
        temp: SearchEngineData = {}

      for (let id of useSearchEngines) {
        const searchEngine = searchEngines[id]
        if (isEmpty(searchEngine)) continue

        temp[id] = searchEngine
      }
      return temp
    }
  },
  mutations: {
    /**
     * 添加搜索历史
     * @param param0
     * @param newHistory
     */
    [SearchMutations.putHistory]: (state, newHistory: HistoryItem) => {
      let history: Array<HistoryItem> = JSON.parse(localStorage[SEARCH_HISTORY_STORAGE] ?? "[]")

      // 去重并在头添加
      history = history.filter(item => item.searchText !== newHistory.searchText)
      history.unshift(newHistory)

      state.history = history
      saveSearchHistory(history)
    },

    /**
     * 删除搜索历史
     * @param param0
     * @param index
     */
    [SearchMutations.deleteHistory]: (state, index: number) => {
      const history: Array<HistoryItem> = JSON.parse(localStorage[SEARCH_HISTORY_STORAGE] ?? "[]")
      history.splice(index, 1)

      state.history = history
      saveSearchHistory(history)
    },

    /**
     * 加载搜索历史
     * @param state
     */
    [SearchMutations.loadHistory]: state => {
      const history: Array<HistoryItem> = JSON.parse(localStorage[SEARCH_HISTORY_STORAGE] ?? "[]")
      state.history = history
    },

    /**
     * 清除所有搜索历史
     * @param state
     */
    [SearchMutations.cleanHistory]: state => {
      state.history = []
      localStorage.removeItem(SEARCH_HISTORY_STORAGE)
    },

    /**
     * 添加自定义搜索引擎
     * @param state
     * @param data
     */
    [SearchMutations.addSearchEngine]: (state, data: SearchEngineItem) => {
      const searchEnginesNew = {
        ...state.searchEngines,
        [data.id]: data
      }

      state.searchEngines = searchEnginesNew
      saveSearchEngineData(searchEnginesNew)
    },

    /**
     * 删除自定义搜索引擎
     * @param state
     * @param searchKey
     */
    [SearchMutations.deleteSearchEngine]: (state, searchKey: string) => {
      const searchEnginesNew = deepClone(state.searchEngines, searchKey)

      state.searchEngines = searchEnginesNew
      saveSearchEngineData(searchEnginesNew)
    }
  },
  actions: {
    /**
     * 提交搜索
     * @param param0
     * @param searchText
     */
    [SearchActions.submitSearch]: ({ rootState, commit, dispatch }, search: string) => {
      const searchTrim = search.trim()
      if (isEmpty(searchTrim)) throw new Error("搜索内容不能为空")

      const setting = rootState.setting.search
      const currentEngine = setting.currentEngine!
      const history: HistoryItem = {
        engineId: currentEngine,
        searchText: searchTrim,
        timestamp: Date.now()
      }
      commit(SearchMutations.putHistory, history)

      const data: SearchData = {
        engine: currentEngine,
        text: searchTrim,
        target: setting.openPageTarget!
      }
      dispatch(SearchActions.openSearchPage, data)
    },

    /**
     * 打开搜索页面
     * @param param0
     * @param search
     */
    [SearchActions.openSearchPage]: ({ state }, search: SearchData) => {
      const { searchEngines } = state

      // 构建搜索URL
      let url = searchEngines[search.engine].baseUrl
      if (url.includes("{searchText}")) url = url.replace("{searchText}", encodeURI(search.text))
      if (url.includes("{inputEncoding}")) url = url.replace("{inputEncoding}", "utf-8")

      window.open(url, search.target)
    },

    /**
     * 获取搜索建议
     * @param param0
     * @param searchText
     * @returns
     */
    [SearchActions.getSuggestion]: ({ rootState }, searchText: string) => {
      const setting = rootState.setting.search

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
