<template>
  <div class="setting-layout">
    <template v-for="item of settingList" :key="item.title">
      <div class="setting-item">
        <h3>
          <component :is="item.icon" />
          {{ item.title }}
        </h3>
        <component :is="item.component" />
      </div>
      <a-divider />
    </template>
  </div>
</template>

<script lang="ts" setup>
import ThemeMode from "./ThemeMode.vue"
import SearchSetting from "./SearchSetting.vue"
import BackgroundSetting from "./BackgroundSetting.vue"
import { DefineComponent, FunctionalComponent } from "vue"
import { BgColorsOutlined, SearchOutlined, PictureOutlined } from "@ant-design/icons-vue"

interface SettingItem {
  title: string
  icon: FunctionalComponent
  component: DefineComponent<{}, {}, any>
}

const settingList: SettingItem[] = [
  {
    title: "主题设置",
    icon: BgColorsOutlined,
    component: ThemeMode
  },
  {
    title: "搜索设置",
    icon: SearchOutlined,
    component: SearchSetting
  },
  {
    title: "背景设置",
    icon: PictureOutlined,
    component: BackgroundSetting
  }
]
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
