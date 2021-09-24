import { createI18n } from "vue-i18n"
import messages from "@intlify/vite-plugin-vue-i18n/messages"

export default createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: navigator.language,
  fallbackLocale: "zh",
  messages
})
