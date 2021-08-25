<template>
  <a-config-provider>
    <home />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { computed, watch, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { ThemeType } from "./store/setting";
import Home from "@views/home/Index.vue";

const store = useStore();
const theme = computed<ThemeType>(() => store.getters["setting/getTheme"]);

function changeTheme(theme: ThemeType) {
  let isDarkMode;
  switch (theme) {
    case ThemeType.auto:
      isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      break;
    case ThemeType.dart:
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

function onSystemThemeChange() {
  const darkMedia: MediaQueryList = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

  if (typeof darkMedia.addEventListener === "function") {
    darkMedia.addEventListener("change", (e) => {
      if (theme.value !== ThemeType.auto) return;

      const isDarkMode = e.matches;
      changeTheme(isDarkMode ? ThemeType.dart : ThemeType.light);
    });
  }
}

watch(theme, (val) => changeTheme(val));

onBeforeMount(() => {
  onSystemThemeChange();
  changeTheme(theme.value);
});
</script>

<style lang="less">
[data-theme="dark"] {
  @import "ant-design-vue/lib/style/dark.less";
  @import "ant-design-vue/lib/comment/style/index.less";
  @import "ant-design-vue/lib/input/style/index.less";
  @import "ant-design-vue/lib/select/style/index.less";
}
</style>
