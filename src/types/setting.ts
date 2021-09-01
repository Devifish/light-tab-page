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

export interface ViewSetting {
  themeMode?: ThemeMode
  background?: BackgroundSetting
}

export interface BackgroundSetting {
  id?: string
  type?: BackgroundType
  url?: string
  blur?: number
  maskColor?: String
  maskOpacity?: number
  autoOpacity?: boolean
}
