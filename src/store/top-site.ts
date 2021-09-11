import { createStoreModule } from "./index"
import { getBrowserTopSites } from "@/plugins/extension"
import { SortData, TopSiteItem, TopSites } from "@/types"
import { copy } from "@/utils/common"
import { debounce } from "@/utils/async"
import { verifyImageUrl } from "@/utils/image"

export interface TopSiteState {
  topSites: TopSites
  init: boolean
}

export interface TopSiteItemVo extends TopSiteItem {
  index: number
}

export enum TopSiteGetters {
  getCurrentTopSites = "GET_CURRENT_TOP_SITES"
}

export enum TopSiteMutations {
  updateTopSite = "UPDATE_TOP_SITE",
  sortTopSites = "SORT_TOP_SITES",
  updateTopSites = "UPDATE_TOP_SITES"
}

export enum TopSiteActions {
  initTopSites = "INIT_TOP_SITES"
}

const TOP_SITE_STORAGE = "top-site-data"

export default createStoreModule<TopSiteState>({
  state() {
    const defaultState: TopSiteState = {
      topSites: [],
      init: false
    }

    const topSitesData = JSON.parse(localStorage[TOP_SITE_STORAGE] ?? "[]")
    copy(topSitesData, defaultState, true)

    return defaultState
  },
  getters: {
    /**
     * 获取当前的导航栏数据
     * @param param0
     * @param rootState
     * @returns
     */
    [TopSiteGetters.getCurrentTopSites]: ({ topSites }, _, rootState) => {
      const topSiteSetting = rootState.setting.topSite
      return topSites.filter((_item, index) => index < topSiteSetting.col * topSiteSetting.row)
    }
  },
  mutations: {
    /**
     * 更新单个导航
     * @param state
     * @param data
     */
    [TopSiteMutations.updateTopSite]: (state, data: TopSiteItemVo) => {
      state.topSites[data.index] = data
      saveTopSiteState(state)
    },

    /**
     * 对导航栏排序
     * @param state
     * @param sort
     */
    [TopSiteMutations.sortTopSites]: (state, sort: SortData) => {
      const topSites = state.topSites
      const from = topSites[sort.from]

      topSites.splice(sort.from, 1)
      topSites.splice(sort.to, 0, from)
      saveTopSiteState(state)
    },

    /**
     * 更新导航栏
     * @param state
     * @param topSites
     */
    [TopSiteMutations.updateTopSites]: (state, topSites: TopSites) => {
      state.topSites = topSites
      saveTopSiteState(state)
    }
  },
  actions: {
    /**
     * 初始化导航
     * 从浏览器获取最近浏览
     * @param param0
     */
    [TopSiteActions.initTopSites]: async ({ state, commit }) => {
      const startTime = Date.now()
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
            textIcon: !verify
          }
        })
      )
      state.init = true

      console.log("load browser top-sites:", `${Date.now() - startTime}ms`)
      commit(TopSiteMutations.updateTopSites, topSites)
    }
  }
})

// 保存数据节流防抖
const saveTopSiteState = debounce((data: TopSiteState) => {
  const settingJson = JSON.stringify(data)
  localStorage.setItem(TOP_SITE_STORAGE, settingJson)
}, 1000)

function getFavicon(url: string) {
  const urlObj = new URL(url)
  return `${urlObj.origin}/favicon.ico`
}
