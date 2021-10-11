import router from "@/router"
import { createStoreModule } from "./index"
import {
  SearchEngineData,
  SearchEngineItem,
  SearchSuggestion,
  HistoryItem,
  SearchData,
  AnalyzeUrl,
  RuleDataMap,
  Rules,
  RuleData
} from "@/types"
import { deepClone, isEmpty } from "@/utils/common"
import { getBaiduSuggestion, getBingSuggestion, getGoogleSuggestion } from "@/api/suggestion"

export interface SearchState {
  searchEngines: SearchEngineData
  history: Array<HistoryItem>
  rules: RuleDataMap
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

const ruleModules = import.meta.globEager("/src/rules/*.json")
const rules: Rules = Object.values(ruleModules).map(item => item.default)
export const DEFAULT_SEARCH_ENGINES: SearchEngineData = Object.fromEntries(
  rules.map(item => [
    item.id,
    {
      id: item.id,
      name: item.name,
      icon: item.icon,
      description: item.description,
      baseUrl: item.search.url
    }
  ])
)

export default createStoreModule<SearchState>({
  state() {
    const defaultState: SearchState = {
      searchEngines: { ...DEFAULT_SEARCH_ENGINES },
      history: [],
      rules: Object.fromEntries(rules.map(item => [item.id, new RuleData(item)]))
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
    [SearchActions.submitSearch]: async ({ rootState, commit, dispatch }, search: string) => {
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
    [SearchActions.openSearchPage]: ({ state, rootState }, search: SearchData) => {
      const { engine, text, target } = search
      const { overwriteSearch } = rootState.setting.search

      if (overwriteSearch) {
        router.push({ name: "SearchResult", params: { engine, text } })
      } else {
        const { searchEngines } = state

        // 构建搜索URL
        const url = AnalyzeUrl.defalut(searchEngines[engine].baseUrl, {
          searchText: text
        }).getUrlString()

        window.open(url, target)
      }
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
