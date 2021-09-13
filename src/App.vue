<template>
  <a-config-provider>
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
import { InjectionKey, Ref, watchEffect } from "vue"

export const CURRENT_THEME_KEY: InjectionKey<Ref<ThemeMode>> = Symbol.for("")
</script>

<script lang="ts" setup>
import { computed, provide } from "vue"
import { useStore } from "./store"
import { ThemeMode } from "./types"
import { usePreferredDark } from "./utils/use"

const store = useStore()
const themeMode = computed(() => store.state.setting.themeMode)

const isDark = usePreferredDark()
const currentTheme = computed(() => {
  const mode = themeMode.value
  if (mode === ThemeMode.Auto) {
    return isDark.value ? ThemeMode.Dart : ThemeMode.Light
  } else {
    return mode
  }
})

// 监听并设置主题
watchEffect(() => {
  const isDark = currentTheme.value === ThemeMode.Dart
  const html = document.body.parentElement!

  html.setAttribute("data-theme", isDark ? "dark" : "light")
})

provide(CURRENT_THEME_KEY, currentTheme)
</script>
