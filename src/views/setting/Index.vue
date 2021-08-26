<template>
  <div class="setting-layout">
    <div class="theme-setting">
      <h3>外观设置</h3>
      <theme-mode class="setting-item" />
      <background-setting class="setting-item" />
    </div>
    <a-divider />
  </div>
</template>

<script lang="ts" setup>
import ThemeMode from "@views/setting/ThemeMode.vue";
import BackgroundSetting from "@views/setting/BackgroundSetting.vue";
import { useDrawer } from "@/utils/use";

const drawer = useDrawer();
</script>

<style lang="less">
.setting-layout {
  .setting-item {
    padding: 8px 0;
  }
}
</style>
