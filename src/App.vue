<template>
  <a-config-provider>
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
import { InjectionKey, Ref } from "vue"

export const CURRENT_THEME_KEY: InjectionKey<Ref<ThemeMode>> = Symbol.for("")
</script>

<script lang="ts" setup>
import { computed, watch, onBeforeMount, ref, provide } from "vue"
import { useStore } from "./store"
import { ThemeMode } from "./types"

const store = useStore()
const themeMode = computed(() => store.state.setting.themeMode)

const currentTheme = ref<ThemeMode>()
const darkColorScheme = "(prefers-color-scheme: dark)"

function changeThemeMode(themeMode: ThemeMode) {
  let isDarkMode: boolean
  switch (themeMode) {
    case ThemeMode.Auto:
      isDarkMode = window.matchMedia(darkColorScheme).matches
      currentTheme.value = isDarkMode ? ThemeMode.Dart : ThemeMode.Light
      break
    default:
      isDarkMode = themeMode === ThemeMode.Dart
      currentTheme.value = themeMode
      break
  }

  // 设置主题模式
  const htmlEle = document.body.parentElement!
  htmlEle.setAttribute("data-theme", isDarkMode ? "dark" : "light")
}

/**
 * 监听系统主题颜色变化事件
 * 如果主题设置是Auto则同步修改
 */
function onSystemThemeChange() {
  const darkMedia: MediaQueryList = window.matchMedia(darkColorScheme)

  if (typeof darkMedia.addEventListener === "function") {
    darkMedia.addEventListener("change", e => {
      if (themeMode.value !== ThemeMode.Auto) return

      const isDarkMode = e.matches
      changeThemeMode(isDarkMode ? ThemeMode.Dart : ThemeMode.Light)
    })
  }
}

/**
 * APP 初始化
 * 同步并监听系统主题模式
 */
function init() {
  onSystemThemeChange()
  changeThemeMode(themeMode.value)
}

// 监听并设置主题
watch(themeMode, val => changeThemeMode(val))

provide(CURRENT_THEME_KEY, currentTheme)
onBeforeMount(init)
</script>
