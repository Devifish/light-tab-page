<template>
  <main id="main-layout">
    <search class="search" />
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </main>
</template>

<script lang="ts" setup>
import Search from "@views/home/Search.vue";

</script>


<style lang="less">
#main-layout {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto 72px 46px auto 1fr;
  justify-items: center;

  .search {
    align-self: end;
  }
}
</style>
