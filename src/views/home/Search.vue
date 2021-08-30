<template>
  <div class="search-layout">
    <div class="search-logo">
      <img :src="searchEngines[currentEngine].icon" class="logo" alt="logo" draggable="false" />
    </div>
    <div class="search-input">
      <a-dropdown :visible="showDropdown">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索"
          enter-button
          size="large"
          ref="searchInput"
          @search="onSearch"
          @focus="onSearchFocus"
          @blur="showDropdown = false"
        >
          <template #addonBefore v-if="searchSetting.showEngineSelect">
            <a-select v-model:value="currentEngine" style="width: 90px">
              <a-select-option v-for="(value, key) in searchEngines" :value="key" :key="key">
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
import { SearchEngineData, SearchSetting } from "@/types";
import { ref, computed } from "vue";
import { useStore } from "vuex";

// Vuex
const store = useStore();

const searchEngines = computed<SearchEngineData>(() => store.getters["search/getUseSearchEngines"]),
  searchSetting = computed<SearchSetting>(() => store.getters["search/getSearchSetting"]),
  searchInputRadius = computed(() => `${searchSetting.value.searchInputRadius}px`),
  searchHistory = ref([]);

// 当前搜索引擎
const currentEngine = computed({
  get: () => searchSetting.value.currentEngine!,
  set: (value) => store.commit("search/updateCurrentEngine", value),
});

// 搜索内容
const searchText = ref("");
const showDropdown = ref(false);
const searchInput = ref();

function onSearch() {
  store.dispatch("search/submitSearch", searchText.value);
}

function onSearchFocus() {
  const history = searchHistory.value;
  if (history.length === 0) return;

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

    .ant-select-selector {
      transition: none;
      .ant-select-selection-item {
        transition: none;
      }
    }

    .ant-input,
    .ant-input-group-addon:first-child {
      transition: none;
      border-bottom-left-radius: v-bind(searchInputRadius);
      border-top-left-radius: v-bind(searchInputRadius);
    }

    .ant-input-search-button {
      transition: none;
      border-bottom-right-radius: v-bind(searchInputRadius);
      border-top-right-radius: v-bind(searchInputRadius);
    }

    // 去除搜索按钮底色（防止在设置壁纸后白底）
    .ant-input-group-addon:last-child {
      background-color: transparent;
    }
  }
}

// 深色模式搜索按钮半透明
[data-theme=dark]
.ant-input-search-button {
  opacity: 0.5;
}
</style>
