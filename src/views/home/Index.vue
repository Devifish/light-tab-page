<template>
  <main class="main-wrap">
    <search />
    <top-site />
  </main>

  <!-- 设置 -->
  <div class="setting-wrap">
    <a-button type="text" @click="settingDrawer.open()">
      <setting-outlined style="font-size: 18px" />
    </a-button>
  </div>

  <!-- 壁纸 -->
  <div class="wallpaper-wrap">
    <wallpaper />
  </div>

  <common-drawer :width="400" :footer="false" ref="settingDrawer">
    <setting />
  </common-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import Search from "./Search.vue"
import TopSite from "./TopSite.vue"
import Wallpaper from "./Wallpaper.vue"
import Setting from "@/views/setting/Index.vue"
import { SettingOutlined } from "@ant-design/icons-vue"

const settingDrawer = ref()
</script>

<style lang="less">
.main-wrap {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 42px;
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
