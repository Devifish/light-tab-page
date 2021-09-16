<template>
  <div class="setting-layout">
    <template v-for="item of settingList" :key="item.title">
      <section class="setting-menu">
        <h3>
          <component :is="item.icon" />
          {{ item.title }}
        </h3>

        <!-- content -->
        <component :is="item.component" />
      </section>
      <a-divider />
    </template>
  </div>
</template>

<script lang="ts" setup>
import ThemeMode from "./ThemeMode.vue"
import SearchSetting from "./SearchSetting.vue"
import BackgroundSetting from "./BackgroundSetting.vue"
import TopSiteSetting from "./TopSiteSetting.vue"
import LayoutSetting from "./LayoutSetting.vue"
import { DefineComponent, FunctionalComponent } from "vue"
import {
  BgColorsOutlined,
  SearchOutlined,
  PictureOutlined,
  InsertRowAboveOutlined,
  AppstoreOutlined
} from "@ant-design/icons-vue"

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
  },
  {
    title: "布局设置",
    icon: InsertRowAboveOutlined,
    component: LayoutSetting
  },
  {
    title: "图标设置",
    icon: AppstoreOutlined,
    component: TopSiteSetting
  }
]
</script>

<style lang="less">
.setting-layout {
  .setting-menu > h3 {
    margin-bottom: 12px;
  }
}
</style>
