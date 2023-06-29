import { createI18n } from "vue-i18n"
import messages from "@intlify/unplugin-vue-i18n/messages"

export default createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: navigator.language,
  fallbackLocale: "zh-CN",
  missingWarn: false,
  fallbackWarn: false,
  messages
})
