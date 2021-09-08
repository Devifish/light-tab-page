<template>
  <main id="popup-layout">
    <search-history />
  </main>
</template>

<script lang="ts" setup>
import SearchHistory from "./SearchHistory.vue"
</script>

<style lang="less">
#popup-layout {
  width: 300px;
  height: 500px;
  max-height: 500px;
}
</style>
