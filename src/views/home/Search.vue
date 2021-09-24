<template>
  <div class="search-warp">
    <div v-if="searchSetting.showEngineIcon" class="search-logo">
      <img :src="searchEngines[currentEngine].icon" class="logo" alt="logo" draggable="false" />
    </div>
    <div class="search-input">
      <a-auto-complete
        v-model:value="searchText"
        size="large"
        :defaultActiveFirstOption="false"
        backfill
        style="width: 100%"
        @search="debounceSearchSuggestion"
      >
        <template #options>
          <a-select-option v-for="item of searchSuggestion" :key="item">
            {{ item }}
          </a-select-option>
        </template>

        <a-input-search
          :placeholder="t('home.search')"
          autoFocus
          enter-button
          size="large"
          @keydown="onSwitchEngines"
          @search="onSearch"
        >
          <template #addonBefore v-if="searchSetting.showEngineSelect">
            <a-select v-model:value="currentEngine" style="width: 90px">
              <a-select-option v-for="(value, key) in searchEngines" :value="key" :key="key">
                {{ value.name }}
              </a-select-option>
            </a-select>
          </template>
        </a-input-search>
      </a-auto-complete>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "@/store"
import { SearchActions, SearchGetters } from "@/store/search"
import { SettingMutations } from "@/store/setting"
import { Option, SearchEngineData, SearchSetting } from "@/types"
import { debounce } from "@/utils/async"
import { isEmpty } from "@/utils/common"
import { ref, computed } from "vue"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const store = useStore()

const searchEngines = computed<SearchEngineData>(
    () => store.getters[SearchGetters.getUseSearchEngines]
  ),
  searchSetting = computed(() => store.state.setting.search),
  searchInputRadius = computed(() => `${searchSetting.value.searchInputRadius}px`),
  searchSuggestion = ref<string[]>()

// 当前搜索引擎
const currentEngine = computed({
  get: () => searchSetting.value.currentEngine!,
  set: currentEngine => updateSearchSetting({ currentEngine })
})

// 搜索内容
const searchText = ref("")
const debounceSearchSuggestion = debounce(handleSearchSuggestion)

function updateSearchSetting(data: Option<SearchSetting>) {
  store.commit(SettingMutations.updateSearchSetting, data)
}

/**
 * 搜索框搜索事件
 * 将搜索内容重定向到搜索引擎
 */
function onSearch(search: string) {
  store.dispatch(SearchActions.submitSearch, search)
}

/**
 * 搜索建议自动完成处理
 * 获取搜索建议数据
 */
async function handleSearchSuggestion(value: string) {
  if (isEmpty(value)) {
    searchSuggestion.value = []
  } else {
    const suggestion = await store.dispatch(SearchActions.getSuggestion, value)
    searchSuggestion.value = suggestion
  }
}

/**
 * 搜索框按 Tab / Shift+Tab
 * 切换当前的搜索引擎
 */
function onSwitchEngines(e: KeyboardEvent) {
  if (e.key !== "Tab") return

  e.preventDefault()

  const engineKeys = Object.keys(searchEngines.value)
  const length = engineKeys.length

  let currentIndex = engineKeys.indexOf(currentEngine.value)
  currentIndex += e.shiftKey ? -1 : 1

  currentEngine.value =
    currentIndex < 0
      ? engineKeys[length - 1]
      : currentIndex < length
      ? engineKeys[currentIndex]
      : engineKeys[0]
}
</script>

<style lang="less">
@logo-h: 64px;
@input-h: 44px;
@search-radius: v-bind(searchInputRadius);

.search-warp {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  row-gap: 64px;

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
      transition: none !important;
      .ant-select-selection-item {
        transition: none !important;
      }
    }

    .ant-input,
    .ant-input-group-addon:first-child {
      transition: none !important;
      border-bottom-left-radius: @search-radius;
      border-top-left-radius: @search-radius;
    }

    .ant-input-group-addon:first-child .ant-select-selection-search {
      display: none;
    }

    .ant-input-search-button {
      transition: none !important;
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
