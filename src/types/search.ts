export interface SearchEngineItem {
  id: string
  name: string
  baseUrl: string
  icon: string
  description: string
}

export type SearchEngineData = Record<string, SearchEngineItem>

export type SearchEngines = Array<SearchEngineItem>

export enum OpenPageTarget {
  Blank = "_blank",
  Self = "_self"
}

export enum SearchSuggestion {
  none,
  baidu,
  bing,
  google
}

export interface SearchSetting {
  currentEngine?: string
  openPageTarget?: OpenPageTarget
  showEngineSelect?: boolean
  searchInputRadius?: number
  useSearchEngines?: Array<string>
  suggestion?: SearchSuggestion
}
