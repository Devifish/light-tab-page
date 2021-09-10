<template>
  <div class="color-radio-warp">
    <div
      v-for="item of colors"
      class="color-item"
      :class="{ active: equalsIgnoreCase(value, item) }"
      :key="item"
      :style="{
        backgroundColor: item,
        borderRadius: `${radius}`
      }"
      @click="onSelectColor(item)"
    >
      <transition name="scale">
        <check-outlined v-if="equalsIgnoreCase(value, item)" class="select-icon" />
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { equalsIgnoreCase } from "@/utils/common"
import { CheckOutlined } from "@ant-design/icons-vue"

interface ColorRadioProps {
  colors: string[]
  radius?: string
  value?: string
}

interface ColorRadioEmits {
  (e: "update:value", color: string): void
}

const props = withDefaults(defineProps<ColorRadioProps>(), {
  radius: "4px"
})

const emits = defineEmits<ColorRadioEmits>()

function onSelectColor(color: string) {
  emits("update:value", color)
}
</script>

<style lang="less">
@import "ant-design-vue/lib/style/themes/index.less";

.color-radio-warp {
  display: flex;
  column-gap: 8px;

  .color-item {
    height: 28px;
    width: 28px;
    border: #f5f5f5 2px solid;
    cursor: pointer;
    transition: border-color 0.3s ease;

    &:hover {
      border-color: @primary-color;
    }

    &.active {
      border-color: @primary-color;
    }

    .select-icon {
      width: 100%;
      color: @primary-color;
      font-size: 14px;
      line-height: 28px;
      text-align: center;

      &.scale-enter-active,
      &.scale-leave-active {
        transition: transform 0.3s ease;
      }

      &.scale-enter-from,
      &.scale-leave-to {
        transform: scale(0);
      }
    }
  }
}
</style>
