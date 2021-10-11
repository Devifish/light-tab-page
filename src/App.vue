<template>
  <config-provider :theme="themeMode" :lang="lang">
    <router-view />
  </config-provider>
</template>

<script lang="ts" setup>
import { computed } from "vue"
import { useStore } from "./store"

const { state } = useStore()
const themeMode = computed(() => state.setting.themeMode)
const lang = computed(() => state.setting.lang)
</script>
