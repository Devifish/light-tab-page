<template>
  <div class="search-warp" ref="searchWarp">
    <div v-if="searchSetting.showEngineIcon" class="search-logo">
      <img :src="searchEngines[currentEngine].icon" class="logo" alt="logo" draggable="false" />
    </div>
    <div class="search-input" ref="searchInput">
      <a-auto-complete
        v-model:value="searchText"
        :open="showComplete"
        :options="searchSuggestion"
        :defaultActiveFirstOption="false"
        :get-popup-container="() => searchWarp!"
        size="large"
        autofocus
        backfill
        style="width: 100%"
        @search="debounceSearchSuggestion"
        @select="showComplete = false"
      >
        <a-input-search
          :placeholder="t('home.search')"
          enter-button
          size="large"
          @keydown="onSwitchEngines"
          @click="showComplete = true"
          @blur="showComplete = false"
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
import { useSettingStore, useSearchStore } from "@/store"
import { Option, SearchEngineData, SearchSetting } from "@/types"
import { debounce } from "@/utils/async"
import { isEmpty } from "@/utils/common"
import { ref, computed, watch } from "vue"
import { useI18n } from "vue-i18n"

interface SearchProps {
  value?: string
}

interface SuggestionItem {
  title?: string
  value: string
}

const { t } = useI18n()
const settingStore = useSettingStore()
const searchStore = useSearchStore()
const props = defineProps<SearchProps>()

const showComplete = ref(false),
  searchWarp = ref<HTMLElement>(),
  searchEngines = computed<SearchEngineData>(() => searchStore.getUseSearchEngines),
  searchSetting = computed(() => settingStore.search),
  searchInputRadius = computed(() => `${searchSetting.value.searchInputRadius}px`),
  searchSuggestion = ref<SuggestionItem[]>()

// 当前搜索引擎
const currentEngine = computed({
  get: () => searchSetting.value.currentEngine!,
  set: currentEngine => updateSearchSetting({ currentEngine })
})

// 搜索内容
const searchText = ref(props.value)
watch(
  () => props.value,
  value => (searchText.value = value ?? "")
)

/**
 * 搜索框搜索事件
 * 将搜索内容重定向到搜索引擎
 */
function onSearch(search: string) {
  searchStore.submitSearch(search)
}

/**
 * 搜索建议自动完成处理
 * 获取搜索建议数据
 */
const debounceSearchSuggestion = debounce(handleSearchSuggestion)
async function handleSearchSuggestion(value: string) {
  if (isEmpty(value)) {
    searchSuggestion.value = []
  } else {
    const suggestion: string[] = await searchStore.getSuggestion(value)
    searchSuggestion.value = suggestion.map(item => ({ value: item }))
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

function updateSearchSetting(data: Option<SearchSetting>) {
  settingStore.updateSearchSetting(data)
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
    transition: all 0.3s ease;
  }

  .search-input {
    width: 700px;

    .ant-input {
      height: @input-h;
    }

    .ant-input-search-button {
      height: @input-h;
      width: 72px;
    }

    .ant-input,
    .ant-input-group-addon:first-child {
      border-bottom-left-radius: @search-radius;
      border-top-left-radius: @search-radius;
    }

    .ant-input-group-addon:first-child .ant-select-selection-search {
      display: none;
    }

    .ant-input-search-button {
      border-bottom-right-radius: @search-radius !important;
      border-top-right-radius: @search-radius !important;
    }

    // 去除搜索按钮底色（防止在设置壁纸后白底）
    .ant-input-group-addon:last-child {
      background-color: transparent;
    }

    .ant-input-group-addon {
      background-color: #ffffff;

      .ant-select-selection-item {
        line-height: 30px;
      }
    }
  }
}

[data-theme="dark"] {
  .search-input {
    .ant-input,
    .ant-input-group-addon {
      background-color: #14141414;
    }

    // 深色模式搜索按钮半透明
    .ant-input-search-button {
      opacity: 0.7;
    }
  }
}
</style>
