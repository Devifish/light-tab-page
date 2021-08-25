<template>
  <div class="setting-layout">
    <div class="theme-setting">
      <h3>主题模式</h3>
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
      <div class="theme-setting"></div>
    </div>
    <a-divider />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { CheckCircleFilled } from "@ant-design/icons-vue";
import { useStore } from "vuex";
import AutoMode from "@/assets/auto-mode.svg";
import LightMode from "@/assets/light-mode.svg";
import DarkMode from "@/assets/dark-mode.svg";
import { ThemeMode } from "@/store/setting";

const themeModes = [
  {
    name: "跟随系统",
    mode: ThemeMode.auto,
    icon: AutoMode,
  },
  {
    name: "浅色模式",
    mode: ThemeMode.light,
    icon: LightMode,
  },
  {
    name: "深色模式",
    mode: ThemeMode.dart,
    icon: DarkMode,
  },
];

const store = useStore();
const themeMode = computed<ThemeMode>(() => store.getters["setting/getThemeMode"]);

function onThemeChange(themeMode: ThemeMode) {
  store.commit("setting/updateThemeMode", themeMode);
}
</script>

<style lang="less">
@import "ant-design-vue/lib/style/themes/index.less";

.setting-layout {
  h3 {
    margin-bottom: 18px !important;
  }

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
