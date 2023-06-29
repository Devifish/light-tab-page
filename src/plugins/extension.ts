import type { App, DirectiveBinding, Plugin } from "vue"
import type { Permissions } from "webextension-polyfill"
import { permissions, topSites, runtime } from "webextension-polyfill"
import { isEmpty } from "@/utils/common"

export const isExtension = runtime ? true : false

export const Permis: Record<string, Permissions.Permissions> = {
  bing: { origins: ["https://cn.bing.com/"] },
  suggestion: {
    origins: [
      "https://suggestion.baidu.com/",
      "https://api.bing.com/",
      "https://suggestqueries.google.com/"
    ]
  },
  topSite: { permissions: ["topSites"] }
}

export async function requestPermissions(permis: Permissions.Permissions): Promise<boolean> {
  const hasPermis = await permissions.contains(permis)
  if (hasPermis) {
    return true
  }

  // 如果没有权限则绑定请求权限事件
  return await permissions.request(permis)
}

const vuePlugin: Plugin = {
  install(app: App) {
    app.directive("permis", {
      async created(el, bind: DirectiveBinding<Permissions.Permissions>) {
        if (!isExtension) return
        if (isEmpty(bind.value)) return

        // 如果没有权限则绑定请求权限事件
        const hasPermis = await permissions.contains(bind.value)
        if (hasPermis) return

        const onRequestPermissions = (e: Event) => {
          e.preventDefault()
          e.stopPropagation()

          // 请求权限，如果成功则重新请求事件
          permissions.request(bind.value).then(isOk => {
            if (isOk) {
              el.removeEventListener("click", onRequestPermissions)
              el.click()
            }
          })
        }

        el.addEventListener("click", onRequestPermissions)
      }
    })
  }
}

export async function getBrowserTopSites() {
  if (isExtension) {
    return await topSites.get()
  } else {
    return []
  }
}

export function getFavicon(url: string) {
  if (isExtension) {
    const faviconUrl = new URL(runtime.getURL("/_favicon/"))
    faviconUrl.searchParams.set("pageUrl", url)
    faviconUrl.searchParams.set("size", "128")
    return faviconUrl.toString()
  } else {
    const urlObj = new URL(url)
    return `${urlObj.origin}/favicon.ico`
  }
}

export default vuePlugin
