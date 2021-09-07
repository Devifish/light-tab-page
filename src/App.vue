<template>
  <a-config-provider>
    <home />
  </a-config-provider>
</template>

<script lang="ts">
import { InjectionKey, Ref } from "vue"

export const CURRENT_THEME_KEY: InjectionKey<Ref<ThemeMode>> = Symbol.for("")
</script>

<script lang="ts" setup>
import { computed, watch, onBeforeMount, ref, provide } from "vue"
import { useStore } from "vuex"
import { ThemeMode } from "./types"
import Home from "@/views/home/Index.vue"
import { SETTING_STORE_KEY } from "./store/setting"

const settingStore = useStore(SETTING_STORE_KEY)
const themeMode = computed(() => settingStore.state.view.themeMode!)

const currentTheme = ref<ThemeMode>()

function changeThemeMode(themeMode: ThemeMode) {
  let isDarkMode: boolean
  switch (themeMode) {
    case ThemeMode.Auto:
      isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
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
  const darkMedia: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)")

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

<style lang="less">
#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

[data-theme="dark"] {
  @import "ant-design-vue/lib/style/dark.less";
  @import "ant-design-vue/lib/comment/style/index.less";
  @import "ant-design-vue/lib/input/style/index.less";
  @import "ant-design-vue/lib/select/style/index.less";
  @import "ant-design-vue/lib/drawer/style/index.less";
  @import "ant-design-vue/lib/divider/style/index.less";
  @import "ant-design-vue/lib/radio/style/index.less";
  @import "ant-design-vue/lib/slider/style/index.less";
  @import "ant-design-vue/lib/switch/style/index.less";
  @import "ant-design-vue/lib/button/style/index.less";
  @import "ant-design-vue/lib/tag/style/index.less";

  .ant-select-selector {
    background-color: transparent !important;
  }

  .ant-list-item-meta-description {
    color: #888888;
  }
}
</style>
