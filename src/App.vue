<template>
  <a-config-provider :locale="locale" :autoInsertSpaceInButton="true">
    <home />
  </a-config-provider>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import zh_CN from "ant-design-vue/es/locale/zh_CN";
import Home from "@/views/home/Index.vue";

// Antd 国际化
const locale = ref(zh_CN);
</script>
