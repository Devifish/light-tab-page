import type { InjectionKey } from "vue"
import { createStore, Store } from "vuex"
import { getBrowserTopSites } from "@/plugins/extension"
import { TopSiteItem, TopSites } from "@/types"
import { copy, isEmpty } from "@/utils/common"
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
      const topSiteSetting = settingStore.state.topSite
      const list = await getBrowserTopSites()
      console.log(list)

      const topSites: TopSites = []
      for (let i = 0; i < list.length; i++) {
        if (i >= topSiteSetting.col * topSiteSetting.row) break

        const temp = list[i]
        let icon: any = temp.favicon || getFavicon(temp.url)

        if (!await verifyImageUrl(icon)) icon = undefined

        topSites.push({
          title: temp.title ?? "无标题",
          url: temp.url,
          icon,
          textIcon: isEmpty(icon)
        })
      }

      state.topSites = topSites
      state.init = true
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
