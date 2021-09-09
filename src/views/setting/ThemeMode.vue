<template>
  <div class="theme-mode">
    <setting-item lable="主题模式">
      <a-space>
        <a-tooltip v-for="item in themeModes" :title="item.name" :key="item.name">
          <div class="theme-item" @click="onThemeChange(item.mode)">
            <img :src="item.icon" />
            <check-circle-filled class="select-icon" v-if="item.mode === themeMode" />
          </div>
        </a-tooltip>
      </a-space>
    </setting-item>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useStore } from "vuex"
import { ThemeMode } from "@/types"
import { CheckCircleFilled } from "@ant-design/icons-vue"
import AutoMode from "@/assets/auto-mode.svg"
import LightMode from "@/assets/light-mode.svg"
import DarkMode from "@/assets/dark-mode.svg"
import { SETTING_STORE_KEY } from "@/store/setting"

const themeModes = [
  {
    name: "跟随系统",
    mode: ThemeMode.Auto,
    icon: AutoMode
  },
  {
    name: "浅色模式",
    mode: ThemeMode.Light,
    icon: LightMode
  },
  {
    name: "深色模式",
    mode: ThemeMode.Dart,
    icon: DarkMode
  }
]

const settingStore = useStore(SETTING_STORE_KEY)
const themeMode = computed(() => settingStore.state.themeMode)

function onThemeChange(themeMode: ThemeMode) {
  settingStore.commit("updateThemeMode", themeMode)
}
</script>

<style lang="less">
@import "ant-design-vue/lib/style/themes/index.less";

.theme-mode {
  .theme-item {
    cursor: pointer;
    position: relative;

    .select-icon {
      color: @primary-color;
      position: absolute;
      bottom: 8px;
      right: 8px;
    }
  }
}
</style>
