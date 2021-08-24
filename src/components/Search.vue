<template>
  <div class="search-layout">
    <div class="search-logo">
      <img :src="activeData.logo" class="logo" alt="logo" />
    </div>
    <div class="search-input">
      <a-dropdown :visible="showDropdown">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索"
          enter-button
          size="large"
          @search="onSearch"
          @focus="onSearchFocus"
          @blur="showDropdown = false"
        >
          <template #addonBefore>
            <a-select v-model:value="avticeSearch" style="width: 90px">
              <a-select-option
                v-for="(value, key) in searchData"
                :value="key"
                :key="key"
              >
                {{ value.name }}
              </a-select-option>
            </a-select>
          </template>
        </a-input-search>

        <template #overlay>
          <a-menu>
            <a-menu-item v-for="(value, index) in searchHistory" :key="index">
              {{ value }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import BaiduLogo from "@/assets/baidu.png";
import BingLogo from "@/assets/bing.svg";

const searchData: Record<string, any> = {
  baidu: {
    name: "百度",
    logo: BaiduLogo,
    url: "https://www.baidu.com/#ie={inputEncoding}&wd={searchText}",
  },
  bing: {
    name: "Bing",
    logo: BingLogo,
    url: "https://cn.bing.com/search?q={searchText}",
  },
};
const searchHistory = [];

const avticeSearch = ref("bing");
const activeData = computed(() => searchData[avticeSearch.value]);
const searchText = ref();
const showDropdown = ref(false);

function onSearch() {
  let url = activeData.value.url;
  url = url.replace("{searchText}", encodeURI(searchText.value));

  // inputEncoding
  if (url.includes("{inputEncoding}"))
    url = url.replace("{inputEncoding}", "utf-8");

  location.href = url;
}

function onSearchFocus() {
  if (searchHistory.length === 0) return;

  showDropdown.value = true;
}

</script>

<style lang="less">
@logo-h: 64px;
@input-h: 44px;

.search-layout {
  display: grid;
  grid-template-rows: @logo-h 100px;
  justify-items: center;

  .search-logo img {
    height: @logo-h;
    width: auto;
  }
  .search-input {
    width: 700px;
    align-self: end;

    .ant-input {
      height: @input-h;
    }

    .ant-input-search-button {
      height: @input-h;
      width: 72px;
    }
  }
}
</style>
