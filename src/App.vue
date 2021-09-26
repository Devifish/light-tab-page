<template>
  <config-provider :theme="themeMode" :lang="lang">
    <router-view />
  </config-provider>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useStore } from "./store"
import ConfigProvider from "./components/ConfigProvider.vue"

const store = useStore()
const themeMode = computed(() => store.state.setting.themeMode)
const lang = computed(() => store.state.setting.lang)
</script>
