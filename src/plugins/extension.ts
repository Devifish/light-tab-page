import { isEmpty } from "@/utils/common"
import { App, ObjectDirective } from "vue"
import { permissions, Permissions } from "webextension-polyfill"

export enum PermissionsType {
  Bing
}

const isExtension = chrome && chrome.extension ? true : false

const vPermis: ObjectDirective<any, PermissionsType> = {
  created(el, bind) {
    if (!isExtension) return
    if (isEmpty(bind.value)) return

    let permis: Permissions.Permissions | undefined
    switch (bind.value) {
      case PermissionsType.Bing:
        permis = { origins: ["https://cn.bing.com/"] }
        break
      default:
        permis = undefined
    }
    if (!permis) return

    // 如果没有权限则绑定请求权限事件
    permissions.contains(permis).then(res => {
      if (res) return

      const onRequestPermissions = (e: Event) => {
        e.preventDefault()

        // 请求权限，如果成功则重新请求事件
        permissions.request(permis!).then(isOk => {
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
