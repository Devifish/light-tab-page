<template>
  <div
    id="wallpaper-image"
    v-if="background.type !== BackgroundType.None"
    :style="{ backgroundImage: `url(${background.url})` }"
  >
    <div class="wallpaper-mask"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeMount } from "vue"
import { useStore } from "vuex"
import { verifyImageUrl } from "@/utils/image"
import { SETTING_STORE_KEY } from "@/store/setting"
import { BackgroundType, ThemeMode } from "@/types"
import { CURRENT_THEME_KEY } from "@/App.vue"

const settingStore = useStore(SETTING_STORE_KEY)
const background = computed(() => settingStore.state.view.background!)

// 获取当前主题
const currentTheme = inject(CURRENT_THEME_KEY)

// 遮罩不透明度
const maskOpacity = computed(() => {
  const defaultOpacity = 0.75
  const { maskOpacity, autoOpacity } = background.value

  return autoOpacity && currentTheme!.value === ThemeMode.Dart
    ? (defaultOpacity + (1 - defaultOpacity) * maskOpacity!).toFixed(2)
    : maskOpacity
})

async function init() {
  const { url, type } = background.value

  // 加载Bing每日壁纸
  if (type === BackgroundType.Bing) settingStore.dispatch("loadBingDailyWallpaper")

  // 如果 URL无效则重新加载
  const verify = await verifyImageUrl(url!)
  if (!verify) settingStore.dispatch("reloadBackgroundImage")
}

onBeforeMount(init)
</script>

<style lang="less">
@wallpaper-blur: v-bind("`${background.blur}px`");

#wallpaper-image {
  position: absolute;
  top: calc(@wallpaper-blur * -2);
  left: calc(@wallpaper-blur * -2);
  right: calc(@wallpaper-blur * -2);
  bottom: calc(@wallpaper-blur * -2);

  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: blur(@wallpaper-blur);

  .wallpaper-mask {
    width: 100%;
    height: 100%;

    background-color: v-bind("background.maskColor");
    opacity: v-bind("maskOpacity");
  }
}
</style>
