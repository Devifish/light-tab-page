<template>
  <div class="setting-layout">
    <template v-for="(item, index) of filterSettingList" :key="item.title">
      <section class="setting-menu">
        <h3>
          <component v-if="item.icon" :is="item.icon" />
          {{ item.title }}
        </h3>

        <!-- content -->
        <component :is="item.component" />
      </section>
      <a-divider v-if="index < filterSettingList.length - 1" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, Ref, shallowRef } from "vue"
import { useStore } from "@/store"
import ThemeMode from "./ThemeMode.vue"
import SearchSetting from "./SearchSetting.vue"
import BackgroundSetting from "./BackgroundSetting.vue"
import TopSiteSetting from "./TopSiteSetting.vue"
import LayoutSetting from "./LayoutSetting.vue"
import About from "./About.vue"
import { DefineComponent, FunctionalComponent } from "vue"
import {
  BgColorsOutlined,
  SearchOutlined,
  PictureOutlined,
  InsertRowAboveOutlined,
  AppstoreOutlined
} from "@ant-design/icons-vue"
import { useI18n } from "vue-i18n"

interface SettingItem {
  title: string
  icon?: FunctionalComponent
  component: DefineComponent<{}, {}, any>
  skip?: boolean | Ref<boolean>
}

const { t } = useI18n()
const store = useStore()
const settingList = shallowRef<SettingItem[]>([
  {
    title: t("theme.setting"),
    icon: BgColorsOutlined,
    component: ThemeMode
  },
  {
    title: t("search.setting"),
    icon: SearchOutlined,
    component: SearchSetting
  },
  {
    title: t("background.setting"),
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
  },
  {
    title: t("about.about"),
    component: About
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
