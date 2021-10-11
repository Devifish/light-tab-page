<template>
  <main
    class="main-wrap"
    :class="{
      'search-center': state.align === AlignType.searchCenter,
      'overall-center': state.align === AlignType.overallCenter
    }"
  >
    <search class="search" :value="state.searchText" :fixed="state.fixedSearch" />

    <transition name="fade">
      <top-site v-if="state.enableTopSite" v-show="!state.fixedSearch" />
    </transition>

    <router-view v-slot="{ route, Component }">
      <transition name="moveY" mode="out-in">
        <keep-alive>
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
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

  <a-drawer v-model:visible="state.settingVisible" :width="400" :closable="false" destroy-on-close>
    <setting />
  </a-drawer>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue"
import { SettingOutlined } from "@ant-design/icons-vue"
import { useStore } from "@/store"
import { AlignType, BackgroundType } from "@/types"
import Search from "./Search.vue"
import TopSite from "./TopSite.vue"
import Wallpaper from "./Wallpaper.vue"
import Setting from "@/views/setting/Index.vue"
import { useRoute } from "vue-router"

const route = useRoute()
const { state: stateX } = useStore()
const state = reactive({
  fixedSearch: computed(() => route.path !== "/"),
  searchText: computed(() => route.params.text as string),
  settingVisible: false,
  align: computed(() => stateX.setting.layout.align),
  enableTopSite: computed(() => stateX.setting.topSite.enable),
  enableWallpaper: computed(() => stateX.setting.background.type !== BackgroundType.None)
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
