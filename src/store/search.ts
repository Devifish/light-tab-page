import { defineStore } from "pinia"
import router from "@/router"
import {
  SearchEngineData,
  SearchEngineItem,
  SearchSuggestion,
  HistoryItem,
  SearchData,
  AnalyzeUrl,
  RuleDataMap,
  Rule,
  Rules,
  RuleData
} from "@/types"
import { deepClone, isEmpty } from "@/utils/common"
import { getBaiduSuggestion, getBingSuggestion, getGoogleSuggestion } from "@/api/suggestion"
import useSettingStore from "./setting"

export interface SearchState {
  searchEngines: SearchEngineData
  history: Array<HistoryItem>
  rules: RuleDataMap
}

const SEARCH_ENGINES_STORAGE = "search-engines"
const SEARCH_HISTORY_STORAGE = "search-history"
const SEARCH_HISTORY_LENGTH = 100

const ruleModules = import.meta.glob<true, string, Rule>("/src/rules/*.json", { eager: true })
const rules: Rules = Object.values(ruleModules)
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

export default defineStore("search", {
  state: (): SearchState => {
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
    getUseSearchEngines: ({ searchEngines }) => {
      const { search } = useSettingStore()
      const useSearchEngines = search.useSearchEngines!,
        temp: SearchEngineData = {}

      for (let id of useSearchEngines) {
        const searchEngine = searchEngines[id]
        if (isEmpty(searchEngine)) continue

        temp[id] = searchEngine
      }
      return temp
    }
  },
  actions: {
    /**
     * 提交搜索
     * @param param0
     * @param searchText
     */
    async submitSearch(search: string) {
      const searchTrim = search.trim()
      if (isEmpty(searchTrim)) throw new Error("搜索内容不能为空")

      const settingStore = useSettingStore()
      const setting = settingStore.search
      const currentEngine = setting.currentEngine!
      const history: HistoryItem = {
        engineId: currentEngine,
        searchText: searchTrim,
        timestamp: Date.now()
      }
      this.putHistory(history)

      const data: SearchData = {
        engine: currentEngine,
        text: searchTrim,
        target: setting.openPageTarget!
      }
      this.openSearchPage(data)
    },

    /**
     * 打开搜索页面
     * @param param0
     * @param search
     */
    openSearchPage(search: SearchData) {
      const { engine, text, target } = search
      const settingStore = useSettingStore()
      const { overwriteSearch } = settingStore.search

      if (overwriteSearch) {
        router.push({ name: "SearchResult", params: { engine, text } })
      } else {
        const searchEngines = this.searchEngines

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
    getSuggestion(searchText: string) {
      const { search } = useSettingStore()

      switch (search.suggestion) {
        case SearchSuggestion.baidu:
          return getBaiduSuggestion(searchText)
        case SearchSuggestion.bing:
          return getBingSuggestion(searchText)
        case SearchSuggestion.google:
          return getGoogleSuggestion(searchText)
        default:
          return []
      }
    },

    /**
     * 添加搜索历史
     * @param param0
     * @param newHistory
     */
    putHistory(newHistory: HistoryItem) {
      let history: Array<HistoryItem> = JSON.parse(localStorage[SEARCH_HISTORY_STORAGE] ?? "[]")

      // 去重并在头添加
      history = history.filter(item => item.searchText !== newHistory.searchText)
      history.unshift(newHistory)

      this.history = history
      saveSearchHistory(history)
    },

    /**
     * 删除搜索历史
     * @param param0
     * @param index
     */
    deleteHistory(index: number) {
      const history: Array<HistoryItem> = JSON.parse(localStorage[SEARCH_HISTORY_STORAGE] ?? "[]")
      history.splice(index, 1)

      this.history = history
      saveSearchHistory(history)
    },

    /**
     * 加载搜索历史
     * @param state
     */
    loadHistory() {
      const history: Array<HistoryItem> = JSON.parse(localStorage[SEARCH_HISTORY_STORAGE] ?? "[]")
      this.history = history
    },

    /**
     * 清除所有搜索历史
     * @param state
     */
    cleanHistory() {
      this.history = []
      localStorage.removeItem(SEARCH_HISTORY_STORAGE)
    },

    /**
     * 添加自定义搜索引擎
     * @param state
     * @param data
     */
    addSearchEngine(data: SearchEngineItem) {
      const searchEnginesNew = {
        ...this.searchEngines,
        [data.id]: data
      }

      this.searchEngines = searchEnginesNew
      saveSearchEngineData(searchEnginesNew)
    },

    /**
     * 删除自定义搜索引擎
     * @param state
     * @param searchKey
     */
    deleteSearchEngine(searchKey: string) {
      const searchEnginesNew = deepClone(this.searchEngines, searchKey)

      this.searchEngines = searchEnginesNew
      saveSearchEngineData(searchEnginesNew)
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
