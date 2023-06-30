<template>
  <config-provider :theme="currentTheme" :lang="currentLang">
    <router-view />
  </config-provider>
</template>

<script lang="ts" setup>
import { useSettingStore } from "./store"
import { storeToRefs } from "pinia"

const settingStore = useSettingStore()
const { currentTheme, currentLang } = storeToRefs(settingStore)
</script>
