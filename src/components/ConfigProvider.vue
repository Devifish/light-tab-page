<template>
  <a-config-provider :theme="themeConfig">
    <slot />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, watchEffect, reactive } from "vue"
import { LanguageType, ThemeMode } from "@/types"
import dayjs from "@/plugins/dayjs"
import { useI18n } from "vue-i18n"
import { theme } from "ant-design-vue"

interface ThemeProviderProps {
  theme: ThemeMode
  lang: string
}

const props = withDefaults(defineProps<ThemeProviderProps>(), {
  theme: ThemeMode.Auto,
  lang: LanguageType.Auto
})

const { locale } = useI18n()
const themeConfig = reactive({
  algorithm: computed(() =>
    props.theme == ThemeMode.Dart ? theme.darkAlgorithm : theme.defaultAlgorithm
  )
})

// 监听并设置主题
watchEffect(() => {
  const isDark = props.theme === ThemeMode.Dart
  const html = document.body.parentElement!

  html.setAttribute("data-theme", isDark ? "dark" : "light")
})

// 监听并设置语言
watchEffect(() => {
  locale.value = props.lang
  dayjs.locale(props.lang.toLowerCase())
})
</script>
