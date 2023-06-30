<template>
  <config-provider :theme="setting.currentTheme" :lang="setting.currentLang">
    <router-view />
  </config-provider>
</template>

<script lang="ts" setup>
import { useSettingStore } from "./store"

const setting = useSettingStore()
</script>
