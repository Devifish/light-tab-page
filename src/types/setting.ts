export enum ThemeMode {
  Auto,
  Light,
  Dart,
}

export enum BackgroundType {
  None,
  Local,
  Bing,
}

export interface ViewSetting {
  themeMode?: ThemeMode;
  backgroundType?: BackgroundType;
  backgroundUrl?: string;
}
