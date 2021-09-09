<template>
  <div class="setting-item" :class="{ horizontal: props.horizontal }">
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
  .setting-lable {
    height: 38px;
    line-height: 38px;

    span {
      font-size: 14px;
    }
  }

  &.horizontal {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
