import localForage from "localforage"

const COMMON_CONFIG: LocalForageOptions = {
  name: "light-tab-page",
  driver: localForage.INDEXEDDB
}

export const wallpaperStore = localForage.createInstance({
  ...COMMON_CONFIG,
  storeName: "wallpaper"
})
