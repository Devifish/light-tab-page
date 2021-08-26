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
import { sleep } from "@/utils/common";
import { ref, computed, watch, onMounted } from "vue";
import { useStore } from "vuex";

// Vuex
const store = useStore();
const searchEngines = computed<SearchEngineData>(() => store.getters["search/getSearchEngines"]);
const searchSetting = computed<SearchSetting>(() => store.getters["search/getSearchSetting"]);
const currentEngine = computed({
  get: () => searchSetting.value.currentEngine!,
  set: (value) => store.commit("search/updateCurrentEngine", value),
});
const searchHistory = ref([]);

// 搜索内容
const searchText = ref();
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

/**
 * 修改搜索输入框圆角半径
 * 开关左右侧Addon时需要重新调用
 */
function changeSearchInputRadius() {
  const radius = searchSetting.value.searchInputRadius!;
  const showEngineSelect = searchSetting.value.showEngineSelect;
  const searchInputRootEl = searchInput.value.$el;
  const searchInputEl = searchInputRootEl.querySelector(".ant-input");
  const searchBtnEl = searchInputRootEl.querySelector(".ant-input-search-button");
  const searchInputAddonEl = searchInputRootEl.querySelector(".ant-input-group-addon");

  // 修改前恢复默认
  searchInputEl.style = {};
  searchBtnEl.style = {};
  searchInputAddonEl.style = {};

  console.log(showEngineSelect ? searchInputAddonEl : searchInputEl);

  // 搜索下拉选项或搜索框右侧样式
  Object.assign(showEngineSelect ? searchInputAddonEl.style : searchInputEl.style, {
    borderTopLeftRadius: `${radius}px`,
    borderBottomLeftRadius: `${radius}px`,
  });

  // 搜索按钮左侧样式
  Object.assign(searchBtnEl.style, {
    borderTopRightRadius: `${radius}px`,
    borderBottomRightRadius: `${radius}px`,
  });
}

// 监听设置变化修改圆角
watch(
  () => searchSetting.value.searchInputRadius,
  () => changeSearchInputRadius()
);
watch(
  () => searchSetting.value.showEngineSelect,
  async () => {
    await sleep(50);
    changeSearchInputRadius();
  }
);

onMounted(() => {
  changeSearchInputRadius();
});
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

  .ant-input-group-addon,
  .ant-input-search-button {
    transition: unset;
  }
}
</style>
