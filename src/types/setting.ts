export enum ThemeMode {
  Auto,
  Light,
  Dart
}

export enum BackgroundType {
  None,
  Local,
  Bing
}

export enum LanguageType {
  Auto = "auto",
  SimplifiedChinese = "zh-CN",
  TraditionalChinese = "zh-TW",
  English = "en"
}

export interface BackgroundSetting {
  id: string | null
  type?: BackgroundType
  url: string | null
  blur?: number
  maskColor?: String
  maskOpacity?: number
  autoOpacity?: boolean
}

export interface TopSiteIcon {
  size: number
}

export interface TopSiteSetting {
  enable: boolean
  row: number
  col: number
  gap: number
  iconSize: number
  boardSize: number
  boardColor: string
  boardOpacity: number
  boardRadius: number
}

export enum AlignType {
  searchCenter,
  overallCenter
}

export interface LayoutSetting {
  align: AlignType
}

export interface PopupSettting {
  current: number
}

export interface ThemeSetting {
  mode: ThemeMode
  primaryColor: string
  colorPalette: Array<string>
}
