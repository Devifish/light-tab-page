<template>
  <div class="setting-layout">
    <template v-for="item of filterSettingList" :key="item.title">
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
import { computed, Ref, ref } from "vue"
import { useStore } from "@/store"
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
  skip?: boolean | Ref<boolean>
}

const store = useStore()
const settingList = ref<SettingItem[]>([
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
    title: "导航栏设置",
    icon: AppstoreOutlined,
    component: TopSiteSetting,
    skip: computed(() => !store.state.setting.topSite.enable)
  }
])

const filterSettingList = computed(() => settingList.value.filter(item => !item.skip))
</script>

<style lang="less">
.setting-layout {
  .setting-menu > h3 {
    margin-bottom: 12px;
  }
}
</style>
