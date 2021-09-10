import type { InjectionKey } from "vue"
import { createStore, Store } from "vuex"
import { getBrowserTopSites } from "@/plugins/extension"
import { TopSiteItem, TopSites } from "@/types"
import { copy } from "@/utils/common"
import { debounce } from "@/utils/async"
import settingStore from "./setting"
import { verifyImageUrl } from "@/utils/image"

interface TopSiteState {
  topSites: TopSites
  init: boolean
}

export interface TopSiteItemVo extends TopSiteItem {
  index: number
}

const TOP_SITE_STORAGE = "top-site-data"
export const TOP_SITE_STORE_KEY: InjectionKey<Store<TopSiteState>> = Symbol()

export default createStore<TopSiteState>({
  state() {
    const defaultState: TopSiteState = {
      topSites: [],
      init: false
    }

    const topSitesData = JSON.parse(localStorage[TOP_SITE_STORAGE] ?? "[]")
    copy(topSitesData, defaultState, true)

    return defaultState
  },
  mutations: {
    updateTopSite(state, data: TopSiteItemVo) {
      state.topSites[data.index] = data
      saveTopSiteState(state)
    },
    updateTopSites(state, topSites: TopSites) {
      state.topSites = topSites
      saveTopSiteState(state)
    }
  },
  actions: {
    async initTopSites({ state }) {
      const startTime = Date.now()
      const topSiteSetting = settingStore.state.topSite
      const list = await getBrowserTopSites()

      // 并行校验图标是否有效
      state.topSites = await Promise.all(
        list
          .filter((_item, index) => index < topSiteSetting.col * topSiteSetting.row)
          .map<Promise<TopSiteItem>>(async item => {
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
      saveTopSiteState(state)
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
