<template>
  <main id="main-layout">
    <search class="search" />
    <div></div>
    <div></div>
    <div class="setting-corner">
      <a-button type="text" @click="$refs['settingDrawer'].open()">
        <setting-outlined style="font-size: 18px" />
      </a-button>
    </div>
    <div></div>
  </main>

  <common-drawer :width="400" :footer="false" ref="settingDrawer">
    <setting />
  </common-drawer>
</template>

<script lang="ts" setup>
import { useDrawer } from "@/utils/use";
import Search from "@views/home/Search.vue";
import Setting from "@views/setting/Index.vue";
import { SettingOutlined } from "@ant-design/icons-vue";
</script>

<style lang="less">
#main-layout {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto 72px auto 1fr;
  justify-items: center;

  .search {
    align-self: end;
  }

  .setting-corner {
    position: fixed;
    top: 32px;
    right: 32px;
  }
}
</style>
