<template>
  <main
    class="main-wrap"
    :class="{
      'search-center': state.align === AlignType.searchCenter,
      'overall-center': state.align === AlignType.overallCenter
    }"
  >
    <search class="search" :value="state.searchText" />

    <transition name="fade">
      <top-site v-if="state.enableTopSite" />
    </transition>
  </main>

  <!-- 设置 -->
  <div class="setting-wrap">
    <a-button type="text" @click="state.settingVisible = true">
      <setting-outlined style="font-size: 18px" />
    </a-button>
  </div>

  <!-- 壁纸 -->
  <div class="wallpaper-wrap">
    <suspense>
      <wallpaper v-if="state.enableWallpaper" />
    </suspense>
  </div>

  <a-drawer v-model:open="state.settingVisible" :width="400" :closable="false" destroy-on-close>
    <setting />
  </a-drawer>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue"
import { SettingOutlined } from "@ant-design/icons-vue"
import { useSettingStore } from "@/store"
import { AlignType, BackgroundType } from "@/types/setting"
import Search from "./Search.vue"
import TopSite from "./TopSite.vue"
import Wallpaper from "./Wallpaper.vue"
import Setting from "@/views/setting/Index.vue"
import { useRoute } from "vue-router"

const route = useRoute()
const settingStore = useSettingStore()
const state = reactive({
  searchText: computed(() => route.params.text as string),
  settingVisible: false,
  align: computed(() => settingStore.layout.align),
  enableTopSite: computed(() => settingStore.topSite.enable),
  enableWallpaper: computed(() => settingStore.background.type !== BackgroundType.None)
})
</script>

<style lang="less">
.main-wrap {
  height: 100%;
  width: 100%;

  &.search-center {
    display: grid;
    grid-template-rows: 1fr 1fr;
    justify-items: center;
    align-items: center;

    .search {
      align-self: end;
    }
  }

  &.overall-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    row-gap: 42px;
  }
}

.setting-wrap {
  position: fixed;
  top: 32px;
  right: 32px;
  z-index: 10;

  .ant-btn {
    transition: none;
  }
}

.wallpaper-wrap {
  position: fixed;
  width: 100%;
  height: 100%;

  top: 0;
  z-index: -10;
}
</style>
