<template>
  <a-config-provider>
    <home />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, watch, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { ThemeMode } from "./types";
import Home from "@views/home/Index.vue";

const store = useStore();
const themeMode = computed<ThemeMode>(() => {
  const viewSetting = store.getters["setting/getViewSetting"];
  return viewSetting.themeMode;
});

function changeThemeMode(themeMode: ThemeMode) {
  let isDarkMode;
  switch (themeMode) {
    case ThemeMode.Auto:
      isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      break;
    case ThemeMode.Dart:
      isDarkMode = true;
      break;
    default:
      isDarkMode = false;
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
  const darkMedia: MediaQueryList = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

  if (typeof darkMedia.addEventListener === "function") {
    darkMedia.addEventListener("change", (e) => {
      if (themeMode.value !== ThemeMode.Auto) return;

      const isDarkMode = e.matches;
      changeThemeMode(isDarkMode ? ThemeMode.Dart : ThemeMode.Light);
    });
  }
}

// 监听并设置主题
watch(themeMode, (val) => changeThemeMode(val));

onBeforeMount(() => {
  onSystemThemeChange();
  changeThemeMode(themeMode.value);
});
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
}
</style>
