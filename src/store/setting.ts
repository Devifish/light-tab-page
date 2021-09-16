import { createStoreModule } from "./index"
import { copy, isEmpty, uuid } from "@/utils/common"
import { wallpaperStore } from "@/plugins/localforage"
import { isImageFile } from "@/utils/image"
import { getDailyWallpaperUrl } from "@/api/bing"
import { debounce } from "@/utils/async"
import { isObjectURL } from "@/utils/browser"
import {
  BackgroundSetting,
  BackgroundType,
  ThemeMode,
  TopSiteSetting,
  Option,
  LayoutSetting,
  AlignType,
  PopupSettting,
  SearchSetting,
  OpenPageTarget,
  SearchSuggestion
} from "@/types"

export interface SettingState {
  themeMode: ThemeMode
  search: SearchSetting
  background: BackgroundSetting
  topSite: TopSiteSetting
  layout: LayoutSetting
  popup: PopupSettting
}

export enum SettingMutations {
  updateThemeMode = "UPDATE_THEME_MODE",
  updateBackgroundSetting = "UPDATE_BACKGROUND_SETTING",
  updateSearchSetting = "UPDATE_SEARCH_SETTING",
  updateTopSiteSetting = "UPDATE_TOP_SITE_SETTING",
  updateLayoutSetting = "UPDATE_LAYOUT_SETTING",
  updatePopupSetting = "UPDATE_POPUP_SETTING"
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
      search: {
        currentEngine: "bing",
        openPageTarget: OpenPageTarget.Blank,
        showEngineSelect: true,
        searchInputRadius: 4,
        useSearchEngines: ["bing", "google", "baidu"],
        suggestion: SearchSuggestion.none
      },
      topSite: {
        enable: false,
        col: 6,
        row: 2,
        gap: 16,
        iconSize: 32,
        boardSize: 64,
        boardRadius: 4,
        boardColor: "#fff",
        boardOpacity: 0.8
      },
      layout: {
        align: AlignType.searchCenter
      },
      popup: {
        current: 0
      }
    }

    const settingData = JSON.parse(localStorage[SETTING_STORAGE] ?? "{}")
    copy(settingData, defaultState, true, true, 1)

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
     * 更新搜索设置
     * @param state
     * @param setting
     */
    [SettingMutations.updateSearchSetting]: (state, search: SearchSetting) => {
      copy(search, state.search)
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
    },

    /**
     * 更新布局设置
     * @param state
     * @param topSite
     */
    [SettingMutations.updateLayoutSetting]: (state, layout: Option<LayoutSetting>) => {
      copy(layout, state.layout)
      saveSettingState(state)
    },

    /**
     * 更新Popup菜单设置
     * @param state
     * @param popup
     */
    [SettingMutations.updatePopupSetting]: (state, popup: Option<PopupSettting>) => {
      copy(popup, state.popup)
      saveSettingState(state)
    }
  },

  actions: {
    /**
     * 上传壁纸
     * @param param0
     * @param imageFile
     */
    [SettingActions.uploadBackgroundImage]: async ({ state, commit }, imageFile: File) => {
      if (!isImageFile(imageFile)) throw new Error("这不是一个图片文件")

      const id = uuid(),
        url = URL.createObjectURL(imageFile),
        url_old = state.background.url

      // 清除上次壁纸，ObjectURL可能导致内存溢出
      await wallpaperStore.clear()
      if (url_old && isObjectURL(url_old)) {
        URL.revokeObjectURL(url_old)
      }

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
}, 250)
