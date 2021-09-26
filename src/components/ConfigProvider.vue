<template>
  <slot />
</template>

<script lang="ts">
import type { InjectionKey, Ref } from "vue"

export const CURRENT_THEME_KEY: InjectionKey<Ref<ThemeMode>> = Symbol.for("")
</script>

<script lang="ts" setup>
import { computed, provide, watchEffect } from "vue"
import { LanguageType, ThemeMode } from "@/types"
import { usePreferredDark } from "@/utils/use"
import dayjs from "@/plugins/dayjs"
import { useI18n } from "vue-i18n"

interface ThemeProviderProps {
  theme: ThemeMode
  lang: LanguageType
}

const prop = withDefaults(defineProps<ThemeProviderProps>(), {
  theme: ThemeMode.Auto,
  lang: LanguageType.Auto
})

const { locale } = useI18n()
const isDark = usePreferredDark()

const currentTheme = computed(() => {
  const { theme } = prop
  if (theme === ThemeMode.Auto) {
    return isDark.value ? ThemeMode.Dart : ThemeMode.Light
  } else {
    return theme
  }
})

const currentLang = computed(() => {
  const { lang } = prop
  return lang === LanguageType.Auto ? navigator.language : lang
})

// 监听并设置主题
watchEffect(() => {
  const isDark = currentTheme.value === ThemeMode.Dart
  const html = document.body.parentElement!

  html.setAttribute("data-theme", isDark ? "dark" : "light")
})

// 监听并设置语言
watchEffect(() => {
  const lang = currentLang.value

  locale.value = lang
  dayjs.locale(lang.toLowerCase())
})

provide(CURRENT_THEME_KEY, currentTheme)
</script>
