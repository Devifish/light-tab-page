import { defineStore } from "pinia"
import useSettingStore from "./setting"
import { getBrowserTopSites, getFavicon } from "@/plugins/extension"
import { SortData, TopSiteItem, TopSites } from "@/types"
import { verifyImageUrl } from "@/utils/img"
import { isEmpty } from "@/utils/common"

export interface TopSiteState {
  topSites: TopSites
  lastUpdateTime?: number
}

export interface TopSiteItemVo extends TopSiteItem {
  index: number
}

export default defineStore("top-site", {
  state: (): TopSiteState => ({
    topSites: [],
    lastUpdateTime: undefined
  }),
  getters: {
    /**
     * 获取当前的导航栏数据
     * @param param0
     * @param rootState
     * @returns
     */
    getCurrentTopSites(): TopSites {
      const { topSite: setting } = useSettingStore()
      return this.topSites.filter((_item, index) => index < setting.col * setting.row)
    }
  },
  actions: {
    /**
     * 同步浏览器导航
     * 从浏览器获取最近浏览
     * @param param0
     */
    async syncBrowserTopSites() {
      const now = Date.now()
      const customTopSites = this.topSites.filter(item => item?.custom)
      const list = await getBrowserTopSites()

      // 并行校验图标是否有效
      const topSites = await Promise.all(
        list.map<Promise<TopSiteItem>>(async item => {
          const icon = item.favicon || getFavicon(item.url)
          const verify = await verifyImageUrl(icon)

          return {
            title: item.title ?? "无标题",
            url: item.url,
            icon: verify ? icon : undefined,
            textIcon: !verify,
            custom: false
          }
        })
      )

      console.log("load browser top-sites:", `${Date.now() - now}ms`)
      this.topSites = customTopSites.concat(topSites)
      this.lastUpdateTime = now
    },

    /**
     * 添加单个导航
     * @param state
     * @param data
     */
    addTopSite(data: TopSiteItem) {
      this.topSites.push(data)
    },
    /**
     * 更新单个导航
     * @param state
     * @param data
     */
    updateTopSite(data: TopSiteItemVo) {
      this.topSites[data.index] = data
    },

    /**
     * 删除导航
     * @param state
     * @param index
     */
    deleteTopSite(index: number) {
      this.topSites.splice(index, 1)
    },

    /**
     * 对导航栏排序
     * @param state
     * @param sort
     */
    sortTopSites(sort: SortData) {
      const topSites = this.topSites
      const from = topSites[sort.from]
      if (isEmpty(from)) return

      topSites.splice(sort.from, 1)
      topSites.splice(sort.to, 0, from)
    }
  }
})
