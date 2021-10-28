<template>
  <div class="theme-setting">
    <setting-item :lable="t('theme.mode')">
      <div class="theme-mode">
        <a-tooltip v-for="item in themeModes" :title="item.name" :key="item.name">
          <div class="theme-item" @click="onThemeChange(item.mode)">
            <img :src="item.icon" />
            <transition name="scale">
              <check-circle-filled class="select-icon" v-if="item.mode === themeMode" />
            </transition>
          </div>
        </a-tooltip>
      </div>
    </setting-item>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { ThemeMode } from "@/types"
import { CheckCircleFilled } from "@ant-design/icons-vue"
import AutoMode from "@/assets/auto-mode.svg"
import LightMode from "@/assets/light-mode.svg"
import DarkMode from "@/assets/dark-mode.svg"
import { useStore } from "@/store"
import { SettingMutations } from "@/store/setting"
import { useI18n } from "vue-i18n"

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

const { t } = useI18n()
const store = useStore()
const themeMode = computed(() => store.state.setting.themeMode)

function onThemeChange(themeMode: ThemeMode) {
  store.commit(SettingMutations.updateThemeMode, themeMode)
}
</script>

<style lang="less">
@import "ant-design-vue/lib/style/themes/index.less";

.theme-setting {
  .theme-mode {
    display: flex;
    column-gap: 8px;

    .theme-item {
      position: relative;
      cursor: pointer;

      img {
        height: 45px;
        width: 52px;
      }

      .select-icon {
        color: @primary-color;
        position: absolute;
        bottom: 8px;
        right: 8px;
      }
    }
  }
}
</style>
