export interface SearchEngineItem {
  name: string;
  baseUrl: string;
  icon: string;
}

export type SearchEngineData = Record<string, SearchEngineItem>;

export enum OpenPageTarget {
  Blank = "_blank",
  Self = "_self",
}

export interface SearchSetting {
  currentEngine?: string;
  openPageTarget?: OpenPageTarget;
  showEngineSelect?: boolean;
  searchInputRadius?: number;
}
