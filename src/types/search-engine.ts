export interface SearchEngineItem {
  name: string;
  baseUrl: string;
  icon: string;
};

export type SearchEngineData = Record<string, SearchEngineItem>;
