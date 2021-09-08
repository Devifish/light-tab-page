<template>
  <div class="search-history-layout">
    <div class="title">
      <h3>
        <history-outlined />
        最近搜索
      </h3>

      <a-tooltip title="清空">
        <a-button type="text" size="small" @click="cleanHistory">
          <rest-outlined />
        </a-button>
      </a-tooltip>
    </div>

    <ul class="history-list">
      <li
        class="history-list-item"
        v-for="(item, index) of searchHistory"
        :key="item.timestamp"
        @mouseover="current = index"
        @mouseleave="current = null"
        @click="openSearchPage(item)"
      >
        <span class="search-text">
          <img :src="searchEngines[item.engineId].icon" :key="item.engineId" />
          {{ item.searchText }}
        </span>

        <a-button
          v-if="current === index"
          type="text"
          size="small"
          @click.stop="deleteHistory(index)"
        >
          <close-outlined />
        </a-button>
        <span v-else class="time-text">
          {{ timediff(item.timestamp, now) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue"
import { useStore } from "vuex"
import { SEARCH_SETTING_KEY } from "@/store/search"
import { CloseOutlined, HistoryOutlined, RestOutlined } from "@ant-design/icons-vue"
import { HistoryItem, OpenPageTarget, SearchData, SearchEngineData } from "@/types"
import { timediff } from "@/utils/common"

// Vuex
const searchStore = useStore(SEARCH_SETTING_KEY)
const searchHistory = computed(() => searchStore.state.history),
  searchEngines = computed<SearchEngineData>(() => searchStore.getters["getUseSearchEngines"])

const current = ref<any>()
const now = Date.now()

function openSearchPage(history: HistoryItem) {
  searchStore.dispatch("openSearchPage", <SearchData>{
    engine: history.engineId,
    text: history.searchText,
    target: OpenPageTarget.Blank
  })
}

function deleteHistory(index: number) {
  searchStore.commit("deleteHistory", index)
}

function cleanHistory() {
  searchStore.commit("cleanHistory")
}
</script>

<style lang="less">
.search-history-layout {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 38px;
    line-height: 38px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 4px;

    h3 {
      font-size: 14px;
      font-weight: bold;
      margin-left: 12px;
      margin-bottom: 0;
    }
  }

  .ant-divider {
    margin: 2px 0;
  }

  .history-list {
    padding: 0 4px;
    list-style: none;
  }

  .history-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 32px;
    line-height: 32px;
    padding: 0 8px;

    &:hover {
      background-color: #eee;
      border-radius: 4px;
      cursor: pointer;
    }

    .search-text {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 220px;

      img {
        height: 16px;
        width: 16px;
        object-fit: contain;
        margin-right: 8px;
      }
    }

    .time-text {
      font-size: 12px;
      color: #888;
    }
  }
}
</style>
