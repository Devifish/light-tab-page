<template>
  <div class="search-layout">
    <div class="search-logo">
      <img :src="searchEngines[currentEngine].icon" class="logo" alt="logo" />
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
            <a-select
              :value="currentEngine"
              style="width: 90px"
              @change="onChangeDefaultEngine"
            >
              <a-select-option
                v-for="(value, key) in searchEngines"
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
import { useStore } from "vuex";

// Vuex
const store = useStore();
const searchEngines = store.getters["search/getSearchEngines"];
const searchHistory = store.getters["search/getHistory"];
const currentEngine = computed(() => store.getters["search/getCurrentEngine"]);

// 搜索内容
const searchText = ref();
const showDropdown = ref(false);

function onSearch() {
  store.dispatch("search/submitSearch", searchText.value);
}

function onSearchFocus() {
  if (searchHistory.length === 0) return;
  showDropdown.value = true;
}

function onChangeDefaultEngine(value) {
  store.commit("search/updateCurrentEngine", value);
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
