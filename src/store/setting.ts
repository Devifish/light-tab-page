import { defineStore } from "pinia"
import { copy, isEmpty, uuid } from "@/utils/common"
import { wallpaperStore } from "@/plugins/localforage"
import { isImageFile } from "@/utils/file"
import { getDailyWallpaperUrl } from "@/api/bing"
import { isObjectURL } from "@/utils/browser"
import { saveAs } from "file-saver"
import useSearchStore from "./search"
import {
  BackgroundSetting,
  BackgroundType,
  ThemeMode,
  TopSiteSetting,
  LayoutSetting,
  AlignType,
  PopupSettting,
  SearchSetting,
  OpenPageTarget,
  SearchSuggestion,
  LanguageType
} from "@/types"

export interface SettingState {
  lang: LanguageType
  themeMode: ThemeMode
  search: SearchSetting
  background: BackgroundSetting
  topSite: TopSiteSetting
  layout: LayoutSetting
  popup: PopupSettting
}

const BACKUP_FILE_MARK = "_MARK_"

export default defineStore("setting", {
  state: (): SettingState => ({
    lang: LanguageType.Auto,
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
  }),
  actions: {
    /**
     * 上传壁纸
     * @param param0
     * @param imageFile
     */
    async uploadBackgroundImage(imageFile: File) {
      if (!isImageFile(imageFile)) throw new Error("这不是一个图片文件")

      const id = uuid(),
        url = URL.createObjectURL(imageFile),
        url_old = this.background.url

      // 清除上次壁纸，ObjectURL可能导致内存溢出
      await wallpaperStore.clear()
      if (url_old && isObjectURL(url_old)) {
        URL.revokeObjectURL(url_old)
      }

      // 保存图片到IndexedDB
      await wallpaperStore.setItem<Blob>(id, imageFile)
      copy({ id, url }, this.background)
    },

    /**
     * 重新加载壁纸
     * 壁纸使用BlobUrl实现，数据生命周期为session
     * @param param0
     */
    async reloadBackgroundImage() {
      const id = this.background?.id!
      const file = await wallpaperStore.getItem<Blob>(id)

      // 校验图片数据是否可用，否则删除该数据
      if (file && isImageFile(file)) {
        const url = URL.createObjectURL(file)
        this.background.url = url
      } else {
        this.background.id = null
        this.background.url = null
        await wallpaperStore.removeItem(id)
      }
    },

    /**
     * 加载Bing每日壁纸
     * @param param0
     * @param imageFile
     */
    async loadBingDailyWallpaper() {
      const url = await getDailyWallpaperUrl()

      if (isEmpty(url)) return
      this.background.url = url
    },

    /**
     * 导出设置数据
     * 使用JSON格式保存
     */
    exportSetting() {
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
    async importSetting(file: File) {
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
