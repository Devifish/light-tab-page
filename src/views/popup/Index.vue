<template>
  <main id="popup-layout">
    <div class="title">
      <a-select v-model:value="current" :bordered="false" size="small">
        <a-select-option v-for="(item, index) of popupMenu" :value="index" :key="item.title">
          <span>
            <component :is="item.icon" />
            {{ item.title }}
          </span>
        </a-select-option>
      </a-select>

      <div v-if="!isEmpty(currentActions)">
        <a-tooltip v-for="item of currentActions" :key="item" :title="item.title">
          <a-button type="text" size="small">
            <component :is="item.icon" />
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <div class="content-warp">
      <component :is="currentComponent" />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, DefineComponent, FunctionalComponent, ref } from "vue"
import { useStore } from "@/store"
import { SearchMutations } from "@/store/search"
import { HistoryOutlined, RestOutlined } from "@ant-design/icons-vue"
import SearchHistory from "./SearchHistory.vue"
import { isEmpty } from "@/utils/common"

interface ActionItem {
  title: string
  icon: FunctionalComponent
  click?: () => void
}

interface PopupMenuItem {
  title: string
  icon: FunctionalComponent
  component: DefineComponent<{}, {}, any>
  actions?: Array<ActionItem>
}

const popupMenu: Array<PopupMenuItem> = [
  {
    title: "最近搜索",
    icon: HistoryOutlined,
    component: SearchHistory,
    actions: [
      {
        title: "清空",
        icon: RestOutlined,
        click: cleanHistory
      }
    ]
  }
]

const current = ref(0)
const currentActions = computed(() => popupMenu[current.value].actions)
const currentComponent = computed(() => popupMenu[current.value].component)

// Vuex
const store = useStore()

function cleanHistory() {
  store.commit(SearchMutations.cleanHistory)
}
</script>

<style lang="less">
@title-h: 38px;

#popup-layout {
  width: 300px;
  height: 500px;
  max-height: 500px;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: @title-h;
    line-height: @title-h;
    padding: 0 8px;
    border-bottom: 1px solid #f0f0f0;

    .ant-select-selector {
      padding: 0 4px;
    }

    span {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 0;
    }
  }

  .content-warp {
    overflow-y: auto;
    height: calc(100% - @title-h);
  }
}
</style>
