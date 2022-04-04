<template>
  <div class="icon-warp">
    <div
      class="icon-content"
      :style="{
        width: toPixel(size),
        height: toPixel(size)
      }"
    >
      <p
        v-if="textIcon || !src"
        class="text-icon"
        :style="{
          fontSize: toPixel(size)
        }"
      >
        {{ getFontIcon() }}
      </p>
      <img v-else class="img-icon" :src="src" alt="logo" draggable="false" />
    </div>

    <slot />
  </div>
</template>

<script lang="ts" setup>
import { isEmpty } from "@/utils/common"
import { toPixel } from "@/utils/format"

interface IconProps {
  src?: string
  textIcon?: boolean
  title?: string
  size?: number
}

const props = withDefaults(defineProps<IconProps>(), {
  textIcon: false,
  size: 32
})

function getFontIcon() {
  if (isEmpty(props.title)) return "无"

  const firstChar = props.title!.trim().charAt(0)
  return firstChar.toUpperCase()
}
</script>

<style lang="less">
.icon-warp {
  position: relative;

  .icon-content {
    width: 32px;
    height: 32px;

    position: absolute;
    inset: 0;
    margin: auto;
    z-index: 1;

    .text-icon {
      text-align: center;
      font-size: 32px;
      line-height: 0.9;
      user-select: none;
    }

    .img-icon {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
