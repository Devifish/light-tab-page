<template>
  <span :class="['icon-tooltip', props.type]">
    <a-tooltip :title="props.title">
      <slot>
        <info-circle-outlined v-if="props.type === 'info'" />
        <exclamation-circle-outlined v-else-if="props.type === 'warn'" />
        <check-circle-outlined v-else-if="props.type === 'success'" />
        <close-circle-outlined v-else-if="props.type === 'error'" />
      </slot>
    </a-tooltip>
  </span>
</template>

<script lang="ts" setup>
import {
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons-vue"

interface IconTooltipProps {
  title: string
  type?: "error" | "info" | "warn" | "success"
}

const props = withDefaults(defineProps<IconTooltipProps>(), {
  type: "info"
})
</script>

<style lang="less">
@import "@/style/default.less";

.icon-tooltip {
  margin-left: 4px;

  &.success {
    color: @success-color;
  }
  &.info {
    color: @info-color;
  }
  &.warn {
    color: @warning-color;
  }
  &.error {
    color: @error-color;
  }
}
</style>
