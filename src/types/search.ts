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
  overwriteSearch: boolean
  currentEngine: string
  openPageTarget: OpenPageTarget
  showEngineIcon: boolean
  showEngineSelect: boolean
  searchInputRadius: number
  useSearchEngines: Array<string>
  suggestion: SearchSuggestion
}

export interface HistoryItem {
  engineId: string
  searchText: string
  timestamp: number
}

export interface SearchData {
  engine: string
  text: string
  target: OpenPageTarget
}

export interface SearchResultItem {
  title?: string
  urlText?: string
  url?: string
  description?: string
  icon?: string
  cover?: string
}

export type SearchResultData = Array<SearchResultItem>
