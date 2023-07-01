<template>
  <a-config-provider :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from "vue"
import { useI18n } from "vue-i18n"
import { theme } from "ant-design-vue"
import { ThemeMode } from "@/types"
import dayjs from "@/plugins/dayjs"
import { useSettingStore } from "./store"

const { locale } = useI18n()
const setting = useSettingStore()
const themeConfig = computed(() => {
  let algorithm = theme.defaultAlgorithm
  if (setting.currentTheme == ThemeMode.Dart) {
    algorithm = theme.darkAlgorithm
  }

  return {
    algorithm,
    token: {
      colorPrimary: setting.theme.primaryColor
    }
  }
})

// 监听并设置主题
watchEffect(() => {
  const isDark = setting.currentTheme === ThemeMode.Dart
  const html = document.body.parentElement!

  html.setAttribute("data-theme", isDark ? "dark" : "light")
  document.body.setAttribute("style", `--primary-color: ${setting.theme.primaryColor}`)
})

// 监听并设置语言
watchEffect(() => {
  locale.value = setting.currentLang
  dayjs.locale(setting.currentLang.toLowerCase())
})
</script>
