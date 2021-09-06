import { isEmpty } from "@/utils/common"
import { App, ObjectDirective } from "vue"
import { permissions, Permissions } from "webextension-polyfill"

export const Permis: Record<string, Permissions.Permissions> = {
  bing: { origins: ["https://cn.bing.com/"] },
  suggestion: {
    origins: [
      "https://suggestion.baidu.com/",
      "https://api.bing.com/",
      "https://suggestqueries.google.com/"
    ]
  }
}

export const isExtension = chrome && chrome.extension ? true : false

const vPermis: ObjectDirective<any, Permissions.Permissions> = {
  created(el, bind) {
    if (!isExtension) return
    if (isEmpty(bind.value)) return

    // 如果没有权限则绑定请求权限事件
    permissions.contains(bind.value).then(res => {
      if (res) return

      const onRequestPermissions = (e: Event) => {
        e.preventDefault()

        // 请求权限，如果成功则重新请求事件
        permissions.request(bind.value).then(isOk => {
          if (isOk) {
            el.removeEventListener("click", onRequestPermissions)
            el.click()
          }
        })
      }

      el.addEventListener("click", onRequestPermissions)
    })
  }
}

export default {
  install(app: App) {
    app.directive("permis", vPermis)
  }
}
