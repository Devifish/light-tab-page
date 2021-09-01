<template>
  <div class="wallpaper-layout" v-if="src">
    <div class="wallpaper-mask"></div>
    <div class="wallpaper-image" :style="{ backgroundImage: `url(${src})` }"></div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount } from "vue"
import { verifyImageUrl } from "@/utils/image"

interface WallpaperProps {
  src?: string
  blur?: string
  maskColor?: string
  maskOpacity?: number
}

interface WallpaperEmits {
  (e: "error"): void
}

const props = withDefaults(defineProps<WallpaperProps>(), {
  blur: "0px",
  maskColor: "#000",
  maskOpacity: 0
})

const emits = defineEmits<WallpaperEmits>()

onBeforeMount(async () => {
  if (!(await verifyImageUrl(props.src!))) {
    emits("error")
  }
})
</script>

<style lang="less">
@wallpaper-blur: v-bind(blur);

.wallpaper-layout {
  position: fixed;
  top: calc(@wallpaper-blur * -2);
  left: calc(@wallpaper-blur * -2);
  right: calc(@wallpaper-blur * -2);
  bottom: calc(@wallpaper-blur * -2);
  z-index: -10;

  .wallpaper-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;

    background-color: v-bind(maskColor);
    opacity: v-bind(maskOpacity);
  }

  .wallpaper-image {
    width: 100%;
    height: 100%;

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    filter: blur(@wallpaper-blur);
  }
}
</style>
