<template>
  <slot />
</template>

<script lang="ts">
import type { InjectionKey, Ref } from "vue"

export const CURRENT_THEME_KEY: InjectionKey<Ref<ThemeMode>> = Symbol.for("")
</script>

<script lang="ts" setup>
import { computed, provide, watchEffect } from "vue"
import { ThemeMode } from "@/types"
import { usePreferredDark } from "@/utils/use"

interface ThemeProviderProps {
  mode: ThemeMode
}

const prop = withDefaults(defineProps<ThemeProviderProps>(), {
  mode: ThemeMode.Auto
})

const isDark = usePreferredDark()
const currentTheme = computed(() => {
  const mode = prop.mode
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
