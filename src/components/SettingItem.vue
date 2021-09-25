<template>
  <div :class="['setting-item', { horizontal: props.horizontal }]">
    <div class="setting-lable">
      <slot name="lable">
        <span>{{ props.lable }}</span>
      </slot>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface SettingItemProps {
  lable?: string
  horizontal?: boolean
}

const props = withDefaults(defineProps<SettingItemProps>(), {
  horizontal: false
})
</script>

<style lang="less">
.setting-item {
  min-height: 38px;

  .setting-lable {
    margin: 8px 0;

    span {
      font-size: 14px;
    }
  }

  &.horizontal {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .setting-lable {
      margin: 0;
    }
  }
}
</style>
