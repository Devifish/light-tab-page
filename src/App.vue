<template>
  <config-provider :theme="themeMode" :lang="lang">
    <router-view />
  </config-provider>
</template>

<script lang="ts" setup>
import { useSettingStore } from "./store"
import { storeToRefs } from "pinia"

const settingStore = useSettingStore()
const { themeMode, lang } = storeToRefs(settingStore)
</script>
