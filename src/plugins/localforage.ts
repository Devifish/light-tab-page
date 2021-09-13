import localForage from "localforage"

const COMMON_CONFIG: LocalForageOptions = {
  name: import.meta.env.npm_package_name,
  driver: localForage.INDEXEDDB
}

export const wallpaperStore = localForage.createInstance({
  ...COMMON_CONFIG,
  storeName: "wallpaper"
})
