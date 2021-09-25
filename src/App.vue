<template>
  <theme-provider :mode="themeMode">
    <router-view />
  </theme-provider>
</template>

<script lang="ts" setup>
import { computed, watchEffect } from "vue"
import { useStore } from "./store"
import ThemeProvider from "./components/ThemeProvider.vue"
import { useI18n } from "vue-i18n"
import { SettingGetters } from "./store/setting"

const { locale } = useI18n()
const store = useStore()
const themeMode = computed(() => store.state.setting.themeMode)

watchEffect(() => {
  locale.value = store.getters[SettingGetters.getCurrentLanguage]
})
</script>
