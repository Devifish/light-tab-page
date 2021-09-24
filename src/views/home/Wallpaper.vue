<template>
  <div
    id="wallpaper-image"
    v-if="!isEmpty(background.url)"
    :style="{ backgroundImage: `url(${background.url})` }"
  >
    <div class="wallpaper-mask"></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue"
import { verifyImageUrl } from "@/utils/file"
import { BackgroundType, ThemeMode } from "@/types"
import { useStore } from "@/store"
import { SettingActions } from "@/store/setting"
import { isEmpty } from "@/utils/common"
import { CURRENT_THEME_KEY } from "@/components/ThemeProvider.vue"

const store = useStore()
const background = computed(() => store.state.setting.background)

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

// 如果 URL无效则重新加载
const verifyBackground = await verifyImageUrl(background.value.url!)
if (!verifyBackground) {
  await store.dispatch(SettingActions.reloadBackgroundImage)
}

// 加载Bing每日壁纸
if (background.value.type === BackgroundType.Bing) {
  await store.dispatch(SettingActions.loadBingDailyWallpaper)
}
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
