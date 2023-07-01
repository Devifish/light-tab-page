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
.icon-tooltip {
  margin-left: 4px;

  &.success {
    color: #52c41a;
  }
  &.info {
    color: #1677ff;
  }
  &.warn {
    color: #faad14;
  }
  &.error {
    color: #ff4d4f;
  }
}
</style>
