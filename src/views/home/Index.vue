<template>
  <main
    class="main-wrap"
    :class="{
      'search-center': state.align === AlignType.searchCenter,
      'overall-center': state.align === AlignType.overallCenter
    }"
  >
    <search class="search" />
    <top-site v-if="state.enableTopSite" />
  </main>

  <!-- 设置 -->
  <div class="setting-wrap">
    <a-button type="text" @click="settingDrawer.open()">
      <setting-outlined style="font-size: 18px" />
    </a-button>
  </div>

  <!-- 壁纸 -->
  <div class="wallpaper-wrap">
    <wallpaper v-if="state.enableWallpaper" />
  </div>

  <common-drawer :width="400" :footer="false" ref="settingDrawer">
    <setting />
  </common-drawer>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue"
import Search from "./Search.vue"
import TopSite from "./TopSite.vue"
import Wallpaper from "./Wallpaper.vue"
import Setting from "@/views/setting/Index.vue"
import { SettingOutlined } from "@ant-design/icons-vue"
import { useStore } from "@/store"
import { AlignType, BackgroundType } from "@/types"

const store = useStore()
const settingDrawer = ref()

const state = reactive({
  align: computed(() => store.state.setting.layout.align),
  enableTopSite: computed(() => store.state.setting.topSite.enable),
  enableWallpaper: computed(() => store.state.setting.background.type !== BackgroundType.None)
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
