<template>
  <a-config-provider>
    <home />
  </a-config-provider>

  <wallpaper
    v-if="background.type !== BackgroundType.None"
    :src="background.url"
    :blur="`${background.blur}px`"
    :maskColor="background.maskColor"
    :maskOpacity="maskOpacity"
    @error="onWallpaperError"
  />
</template>

<script lang="ts" setup>
import { computed, watch, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import { BackgroundType, ThemeMode } from "./types";
import Home from "@/views/home/Index.vue";
import { SETTING_STORE_KEY } from "./store/setting";

const settingStore = useStore(SETTING_STORE_KEY);
const themeMode = computed(() => settingStore.state.view.themeMode!);
const background = computed(() => settingStore.state.view.background!);

// 当前主题
const currentTheme = ref<ThemeMode>();

// 遮罩不透明度
const maskOpacity = computed(() => {
  const defaultOpacity = 0.75;
  const { maskOpacity, autoOpacity } = background.value;

  return autoOpacity && currentTheme.value === ThemeMode.Dart
    ? (defaultOpacity + (1 - defaultOpacity) * maskOpacity!).toFixed(2)
    : maskOpacity;
});

/**
 * APP 初始化
 * 完成启动时必须加载处理的任务
 */
function init() {
  const backgroundType = background.value.type!;

  // 同步并监听系统主题模式
  onSystemThemeChange();
  changeThemeMode(themeMode.value);

  // 如果是Bing每日壁纸则重新加载
  if (backgroundType === BackgroundType.Bing) {
    settingStore.dispatch("loadBingDailyWallpaper");
  }
}

function changeThemeMode(themeMode: ThemeMode) {
  let isDarkMode: boolean;
  switch (themeMode) {
    case ThemeMode.Auto:
      isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      currentTheme.value = isDarkMode ? ThemeMode.Dart : ThemeMode.Light;
      break;
    default:
      isDarkMode = themeMode === ThemeMode.Dart;
      currentTheme.value = themeMode;
      break;
  }

  // 设置主题模式
  const htmlEle = document.body.parentElement!;
  htmlEle.setAttribute("data-theme", isDarkMode ? "dark" : "light");
}

/**
 * 监听系统主题颜色变化事件
 * 如果主题设置是Auto则同步修改
 */
function onSystemThemeChange() {
  const darkMedia: MediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

  if (typeof darkMedia.addEventListener === "function") {
    darkMedia.addEventListener("change", (e) => {
      if (themeMode.value !== ThemeMode.Auto) return;

      const isDarkMode = e.matches;
      changeThemeMode(isDarkMode ? ThemeMode.Dart : ThemeMode.Light);
    });
  }
}

function onWallpaperError() {
  settingStore.dispatch("reloadBackgroundImage");
}

// 监听并设置主题
watch(themeMode, (val) => changeThemeMode(val));

onBeforeMount(init);
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
