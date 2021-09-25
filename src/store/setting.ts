import { createStoreModule } from "./index"
import { copy, isEmpty, uuid } from "@/utils/common"
import { wallpaperStore } from "@/plugins/localforage"
import { isImageFile } from "@/utils/file"
import { getDailyWallpaperUrl } from "@/api/bing"
import { debounce } from "@/utils/async"
import { isObjectURL } from "@/utils/browser"
import { saveAs } from "file-saver"
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
  lang: string
  themeMode: ThemeMode
  search: SearchSetting
  background: BackgroundSetting
  topSite: TopSiteSetting
  layout: LayoutSetting
  popup: PopupSettting
}

export enum SettingGetters {
  getCurrentLanguage = "GET_CURRENT_LANGUAGE"
}

export enum SettingMutations {
  updateLanguage = "UPDATE_LANGUAGE",
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
  loadBingDailyWallpaper = "LOAD_BING_DAILY_WALLPAPER",
  exportSetting = "EXPORT_SETTING",
  importSetting = "IMPORT_SETTING"
}

const SETTING_STORAGE = "setting-data"
const BACKUP_FILE_MARK = "_MARK_"

export default createStoreModule<SettingState>({
  state() {
    const defaultState: SettingState = {
      lang: "auto",
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
        showEngineIcon: true,
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
  getters: {
    /**
     * 获取当前的语言
     * @param param0
     * @returns
     */
    [SettingGetters.getCurrentLanguage]: ({ lang }) => {
      return lang === "auto" ? navigator.language : lang
    }
  },
  mutations: {
    /**
     * 更新语言
     * @param state
     * @param lang
     */
    [SettingMutations.updateLanguage]: (state, lang: string) => {
      state.lang = lang
      saveSettingState(state)
    },

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
    },

    /**
     * 导出设置数据
     * 使用JSON格式保存
     */
    [SettingActions.exportSetting]: () => {
      const { npm_package_name, npm_package_version } = import.meta.env
      const dataJson = JSON.stringify({
        [BACKUP_FILE_MARK]: npm_package_name,
        ...window.localStorage
      })

      // 保存文件
      const blob = new Blob([dataJson], { type: "application/json;charset=utf-8" })
      saveAs(blob, `${npm_package_name}_${npm_package_version}.json`)
    },

    /**
     * 导入设置数据
     * 使用JSON格式保存
     */
    [SettingActions.importSetting]: async (_, file: File) => {
      if (!file.type.includes("json")) throw new Error("导入文件不匹配")

      const dataJson = await file.text()
      const data = JSON.parse(dataJson)
      const { npm_package_name } = import.meta.env
      if (data[BACKUP_FILE_MARK] !== npm_package_name) throw new Error("备份文件已损坏")

      for (let item in data) {
        if (item === BACKUP_FILE_MARK) continue
        localStorage.setItem(item, data[item])
      }
    }
  }
})

// 保存设置数据节流防抖
const saveSettingState = debounce((data: SettingState) => {
  const settingJson = JSON.stringify(data)
  localStorage.setItem(SETTING_STORAGE, settingJson)
}, 250)
