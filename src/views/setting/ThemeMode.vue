<template>
  <div class="theme-mode">
    <h4>主题模式</h4>
    <a-row>
      <a-col
        class="theme-item"
        v-for="item in themeModes"
        :span="4"
        :key="item.name"
      >
        <a-tooltip :title="item.name">
          <div @click="onThemeChange(item.mode)">
            <img :src="item.icon" />
            <check-circle-filled
              class="select-icon"
              v-if="item.mode === themeMode"
            />
          </div>
        </a-tooltip>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { ThemeMode, ViewSetting } from "@/types";
import { CheckCircleFilled } from "@ant-design/icons-vue";
import AutoMode from "@/assets/auto-mode.svg";
import LightMode from "@/assets/light-mode.svg";
import DarkMode from "@/assets/dark-mode.svg";

const themeModes = [
  {
    name: "跟随系统",
    mode: ThemeMode.Auto,
    icon: AutoMode,
  },
  {
    name: "浅色模式",
    mode: ThemeMode.Light,
    icon: LightMode,
  },
  {
    name: "深色模式",
    mode: ThemeMode.Dart,
    icon: DarkMode,
  },
];

const store = useStore();
const themeMode = computed<ThemeMode>(() => {
  const viewSetting = store.getters["setting/getViewSetting"];
  return viewSetting.themeMode;
});

function onThemeChange(themeMode: ThemeMode) {
  const viewSetting: ViewSetting = { themeMode };
  store.commit("setting/updateViewSetting", viewSetting);
}
</script>

<style lang="less">
@import "ant-design-vue/lib/style/themes/index.less";

.theme-mode {
  .theme-item {
    .select-icon {
      color: @primary-color;
      position: absolute;
      bottom: 8px;
      right: 12px;
    }
  }
}
</style>
