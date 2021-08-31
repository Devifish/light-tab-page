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
          @keydown="onSwitchEngines"
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
import { SEARCH_SETTING_KEY } from "@/store/search";
import { SearchEngineData } from "@/types";
import { ref, computed } from "vue";
import { useStore } from "vuex";

// Vuex
const searchStore = useStore(SEARCH_SETTING_KEY);

const searchEngines = computed<SearchEngineData>(() => searchStore.getters["getUseSearchEngines"]),
  searchSetting = computed(() => searchStore.state.setting),
  searchInputRadius = computed(() => `${searchSetting.value.searchInputRadius}px`),
  searchHistory = ref([]);

// 当前搜索引擎
const currentEngine = computed({
  get: () => searchSetting.value.currentEngine!,
  set: (value) => searchStore.commit("updateCurrentEngine", value),
});

// 搜索内容
const searchText = ref("");
const showDropdown = ref(false);

/**
 * 搜索框搜索事件
 * 将搜索内容重定向到搜索引擎
 */
function onSearch() {
  searchStore.dispatch("submitSearch", searchText.value);
}

function onSearchFocus() {
  const history = searchHistory.value;
  if (history.length === 0) return;

  showDropdown.value = true;
}

/**
 * 搜索框按 Tab / Shift+Tab
 * 切换当前的搜索引擎
 */
function onSwitchEngines(e: KeyboardEvent) {
  if (e.key !== "Tab") return;

  e.preventDefault();

  const engineKeys = Object.keys(searchEngines.value);
  const length = engineKeys.length;

  let currentIndex = engineKeys.indexOf(currentEngine.value);
  currentIndex += e.shiftKey ? -1 : 1;

  currentEngine.value =
    currentIndex < 0
      ? engineKeys[length - 1]
      : currentIndex < length
      ? engineKeys[currentIndex]
      : engineKeys[0];
}
</script>

<style lang="less">
@logo-h: 64px;
@input-h: 44px;
@search-radius: v-bind(searchInputRadius);

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
      border-bottom-left-radius: @search-radius;
      border-top-left-radius: @search-radius;
    }

    .ant-input-search-button {
      transition: none;
      border-bottom-right-radius: @search-radius;
      border-top-right-radius: @search-radius;
    }

    // 去除搜索按钮底色（防止在设置壁纸后白底）
    .ant-input-group-addon:last-child {
      background-color: transparent;
    }
  }
}

// 深色模式搜索按钮半透明
[data-theme="dark"] .ant-input-search-button {
  opacity: 0.5;
}
</style>
