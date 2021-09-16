<template>
  <theme-provider :mode="themeMode">
    <router-view />
  </theme-provider>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useStore } from "./store"
import ThemeProvider from "./components/ThemeProvider.vue"

const store = useStore()
const themeMode = computed(() => store.state.setting.themeMode)
</script>
