<template>
  <div class="wallpaper-layout" v-if="src">
    <div class="wallpaper-mask"></div>
    <div class="wallpaper-image" :style="{ backgroundImage: `url(${src})` }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount } from "vue";
import { verifyImageUrl } from "@/utils/image";

export default defineComponent({
  props: {
    src: String,
    blur: {
      type: String,
      default: "0px",
    },
    maskColor: {
      type: String,
      default: "#000",
    },
    maskOpacity: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    onBeforeMount(async () => {
      const isOk = await verifyImageUrl(props.src!)
      if (!isOk) ctx.emit("error");
    })
  },
});
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
    background-position: center 0;
    filter: blur(@wallpaper-blur);
  }
}
</style>
