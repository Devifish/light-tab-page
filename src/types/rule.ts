import type { SearchEngineItem, SearchResultData } from "./search"
import { AnalyzeCss, AnalyzeUrl } from "./analyze"

export interface Rule {
  id: string
  name: string
  description: string,
  icon: string
  search: SearchRule
}

export type Rules = Array<Rule>

export interface SearchRule {
  url: string
  list: string
  itemTitle: string
  itemUrl: string
  itemIcon: string
  itemCover: string
  itemDesc: string
}

export type RuleDataMap = Record<string, RuleData>

export class RuleData implements Rule {
  readonly id: string
  readonly name: string
  readonly description: string
  readonly icon: string
  readonly search: SearchRule

  constructor(data: string | Rule) {
    if (typeof data === "string") data = JSON.parse(data)
    if (typeof data === "object") {
      this.id = data.id
      this.name = data.name
      this.description = data.description
      this.icon = data.icon
      this.search = data.search
    } else throw new Error("error data")
  }

  async getSearchList(searchText: string, page: number = 0) {
    const url = AnalyzeUrl.defalut(this.search.url, { page, searchText }).getUrlString()
    const analyzeCss = await AnalyzeCss.load(url)
    const searchList = analyzeCss.getElements(this.search.list)

    const data: SearchResultData = []
    for (let searchItem of searchList) {
      const title = searchItem.getString(this.search.itemTitle),
        url = searchItem.getString(this.search.itemUrl),
        description = searchItem.getString(this.search.itemDesc),
        cover = searchItem.getString(this.search.itemCover),
        icon = searchItem.getString(this.search.itemIcon)

      data.push({
        title,
        url,
        urlText: url,
        description,
        cover,
        icon
      })
    }

    return data
  }
}
