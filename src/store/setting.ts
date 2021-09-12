import { createStoreModule } from "./index"
import { BackgroundSetting, BackgroundType, ThemeMode, TopSiteSetting, Option } from "@/types"
import { copy, isEmpty, uuid } from "@/utils/common"
import { wallpaperStore } from "@/plugins/localforage"
import { isImageFile } from "@/utils/image"
import { getDailyWallpaperUrl } from "@/api/bing"
import { debounce } from "@/utils/async"

export interface SettingState {
  themeMode: ThemeMode
  background: BackgroundSetting
  topSite: TopSiteSetting
}

export enum SettingMutations {
  updateThemeMode = "UPDATE_THEME_MODE",
  updateBackgroundSetting = "UPDATE_BACKGROUND_SETTING",
  updateTopSiteSetting = "UPDATE_TOP_SITE_SETTING"
}

export enum SettingActions {
  uploadBackgroundImage = "UPLOAD_BACKGROUND_IMAGE",
  reloadBackgroundImage = "RELOAD_BACKGROUND_IMAGE",
  loadBingDailyWallpaper = "LOAD_BING_DAILY_WALLPAPER"
}

const SETTING_STORAGE = "setting-data"

export default createStoreModule<SettingState>({
  state() {
    const defaultState: SettingState = {
      themeMode: ThemeMode.Auto,
      background: {
        id: "",
        type: BackgroundType.None,
        url: "",
        blur: 0,
        maskColor: "#000",
        maskOpacity: 0,
        autoOpacity: true
      },
      topSite: {
        col: 6,
        row: 2,
        gap: 16,
        iconSize: 32,
        boardSize: 64,
        boardRadius: 4,
        boardColor: "#fff",
        boardOpacity: 0.8
      }
    }

    const settingData = JSON.parse(localStorage[SETTING_STORAGE] ?? "{}")
    copy(settingData, defaultState, true)

    return defaultState
  },
  getters: {},
  mutations: {
    /**
     * 更新主题模式
     * @param state
     * @param mode
     */
    [SettingMutations.updateThemeMode]: (state, mode: ThemeMode) => {
      state.themeMode = mode
      saveSettingState(state)
    },

    /**
     * 更新背景设置
     * @param state
     * @param background
     */
    [SettingMutations.updateBackgroundSetting]: (state, background: Option<BackgroundSetting>) => {
      copy(background, state.background)
      saveSettingState(state)
    },

    /**
     * 更新导航栏设置
     * @param state
     * @param topSite
     */
    [SettingMutations.updateTopSiteSetting]: (state, topSite: Option<TopSiteSetting>) => {
      copy(topSite, state.topSite)
      saveSettingState(state)
    }
  },

  actions: {
    /**
     * 上传壁纸
     * @param param0
     * @param imageFile
     */
    [SettingActions.uploadBackgroundImage]: async ({ commit }, imageFile: File) => {
      if (!isImageFile(imageFile)) throw new Error("这不是一个图片文件")

      const id = uuid()
      const url = URL.createObjectURL(imageFile)

      // 清除上次壁纸
      await wallpaperStore.clear()

      // 保存图片到IndexedDB
      await wallpaperStore.setItem<Blob>(id, imageFile)
      commit(SettingMutations.updateBackgroundSetting, {
        id,
        url
      })
    },

    /**
     * 重新加载壁纸
     * 壁纸使用BlobUrl实现，数据生命周期为session
     * @param param0
     */
    [SettingActions.reloadBackgroundImage]: async ({ state, commit }) => {
      const id = state.background?.id!
      const file = await wallpaperStore.getItem<Blob>(id)

      // 校验图片数据是否可用，否则删除该数据
      if (file && isImageFile(file)) {
        const url = URL.createObjectURL(file)
        commit(SettingMutations.updateBackgroundSetting, { url })
      } else {
        commit(SettingMutations.updateBackgroundSetting, { id: null, url: null })
        await wallpaperStore.removeItem(id)
      }
    },

    /**
     * 加载Bing每日壁纸
     * @param param0
     * @param imageFile
     */
    [SettingActions.loadBingDailyWallpaper]: async ({ commit }) => {
      const url = await getDailyWallpaperUrl()

      if (isEmpty(url)) return
      commit(SettingMutations.updateBackgroundSetting, { url })
    }
  }
})

// 保存设置数据节流防抖
const saveSettingState = debounce((data: SettingState) => {
  const settingJson = JSON.stringify(data)
  localStorage.setItem(SETTING_STORAGE, settingJson)
}, 1000)
