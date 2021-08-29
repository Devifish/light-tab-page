<template>
  <div class="setting-layout">
    <template v-for="item of settingList" :key="item.title">
      <div class="setting-item">
        <h3>{{ item.title }}</h3>
        <component :is="item.component" />
      </div>
      <a-divider />
    </template>
  </div>
</template>

<script lang="ts" setup>
import ThemeMode from "@views/setting/ThemeMode.vue";
import SearchSetting from "@views/setting/SearchSetting.vue";
import BackgroundSetting from "@views/setting/BackgroundSetting.vue";
import { DefineComponent } from "vue";

interface SettingItem {
  title: string;
  component: DefineComponent<{}, {}, any>;
}

const settingList: SettingItem[] = [
  {
    title: "主题设置",
    component: ThemeMode,
  },
  {
    title: "搜索设置",
    component: SearchSetting,
  },
  {
    title: "壁纸设置",
    component: BackgroundSetting,
  },
];
</script>

<style lang="less">
.setting-layout {
  .setting-item > h3 {
    margin-bottom: 12px;
  }

  .lable-text {
    height: 38px;
    line-height: 38px;
  }
}
</style>
