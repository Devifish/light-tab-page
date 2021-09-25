<template>
  <div class="setting-layout">
    <template v-for="(item, index) of settingList" :key="item.key">
      <section class="setting-menu">
        <h3>
          <component v-if="item.icon" :is="item.icon" />
          {{ item.title }}
        </h3>

        <!-- content -->
        <component :is="item.component" />
      </section>
      <a-divider v-if="index < settingList.length - 1" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, Ref } from "vue"
import { useStore } from "@/store"
import ThemeMode from "./ThemeMode.vue"
import SearchSetting from "./SearchSetting.vue"
import BackgroundSetting from "./BackgroundSetting.vue"
import TopSiteSetting from "./TopSiteSetting.vue"
import LayoutSetting from "./LayoutSetting.vue"
import OtherSetting from "./OtherSetting.vue"
import About from "./About.vue"
import { DefineComponent, FunctionalComponent } from "vue"
import { useI18n } from "vue-i18n"
import {
  BgColorsOutlined,
  SearchOutlined,
  PictureOutlined,
  InsertRowAboveOutlined,
  AppstoreOutlined
} from "@ant-design/icons-vue"

interface SettingItem {
  key: string
  title: string | Ref<string>
  icon?: FunctionalComponent
  component: DefineComponent<{}, {}, any>
  skip?: boolean | Ref<boolean>
}

const { t } = useI18n()
const store = useStore()
const settingList = computed<Array<SettingItem>>(() =>
  [
    {
      key: "ThemeMode",
      title: t("theme.setting"),
      icon: BgColorsOutlined,
      component: ThemeMode
    },
    {
      key: "SearchSetting",
      title: t("search.setting"),
      icon: SearchOutlined,
      component: SearchSetting
    },
    {
      key: "BackgroundSetting",
      title: t("background.setting"),
      icon: PictureOutlined,
      component: BackgroundSetting
    },
    {
      key: "LayoutSetting",
      title: t("layout.setting"),
      icon: InsertRowAboveOutlined,
      component: LayoutSetting
    },
    {
      key: "TopSiteSetting",
      title: t("topsite.setting"),
      icon: AppstoreOutlined,
      component: TopSiteSetting,
      skip: !store.state.setting.topSite.enable
    },
    {
      key: "OtherSetting",
      title: t("other.setting"),
      component: OtherSetting
    },
    {
      key: "About",
      title: t("about.text"),
      component: About
    }
  ].filter(item => !item.skip)
)
</script>

<style lang="less">
.setting-layout {
  .setting-menu > h3 {
    margin-bottom: 12px;
  }
}
</style>
