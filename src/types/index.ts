export * from "./search"
export * from "./setting"

export interface TopSiteItem {
  title: string
  url: string
  icon?: string
  color?: string
  textIcon: boolean
  custom: boolean
}

export type TopSites = Array<TopSiteItem>

export enum DragType {
  start,
  enter,
  over,
  end
}

export type SortData = {
  from: number
  to: number
}

export type Option<T> = {
  [K in keyof T]?: T[K]
}
