<template>
  <div :class="['search-warp', { fixed: fixed }]" ref="searchWarp">
    <div v-if="searchSetting.showEngineIcon" class="search-logo">
      <img :src="searchEngines[currentEngine].icon" class="logo" alt="logo" draggable="false" />
    </div>
    <div class="search-input" ref="searchInput">
      <a-auto-complete
        v-model:value="searchText"
        :options="searchSuggestion"
        :defaultActiveFirstOption="false"
        size="large"
        autofocus
        backfill
        style="width: 100%"
        @search="debounceSearchSuggestion"
      >
        <a-input-search
          :placeholder="t('home.search')"
          enter-button
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
import { ref, computed, watch, nextTick } from "vue"
import { useI18n } from "vue-i18n"

interface SearchProps {
  fixed?: boolean
  value?: string
}

interface SuggestionItem {
  title?: string
  value: string
}

const { t } = useI18n()
const { state: stateX, getters, commit, dispatch } = useStore()
const props = defineProps<SearchProps>()

const searchEngines = computed<SearchEngineData>(() => getters[SearchGetters.getUseSearchEngines]),
  searchSetting = computed(() => stateX.setting.search),
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

// 当fixed变化时添加动画
const searchInput = ref<Element>()
watch(
  () => props.fixed,
  () => {
    const $el = searchInput.value!
    const first = $el.getBoundingClientRect()

    // 获取新位置并添加动画
    nextTick(() => {
      const last = $el.getBoundingClientRect(),
        invertY = first.y - last.y,
        invertX = first.x - last.x

      $el.animate(
        [{ transform: `translate(${invertX}px ,${invertY}px)` }, { transform: "translate(0, 0)" }],
        {
          duration: 300,
          easing: "cubic-bezier(0,0,0.32,1)"
        }
      )
    })
  }
)

/**
 * 搜索框搜索事件
 * 将搜索内容重定向到搜索引擎
 */
function onSearch(search: string) {
  dispatch(SearchActions.submitSearch, search)
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
    const suggestion: string[] = await dispatch(SearchActions.getSuggestion, value)
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
  commit(SettingMutations.updateSearchSetting, data)
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

  &.fixed {
    position: fixed;
    flex-direction: row;
    justify-content: center;
    height: 96px;
    width: 100%;
    top: 0;
    column-gap: 16px;
    z-index: 10;
    background-color: rgba(225, 225, 225, 0.5);
    backdrop-filter: saturate(125%) blur(8px);
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.15);

    .search-logo img {
      width: 128px;
      height: 32px;
      object-fit: contain;
    }
  }

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

[data-theme="dark"] {
  .search-warp.fixed {
    background-color: rgba(0, 0, 0, 0.5);
  }

  // 深色模式搜索按钮半透明
  .ant-input-search-button {
    opacity: 0.5;
  }
}
</style>
