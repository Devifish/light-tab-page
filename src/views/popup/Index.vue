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

      <div class="action-menu" v-if="currentMenu">
        <a-tooltip v-for="item of currentMenu.actions" :key="item" :title="item.title">
          <a-button type="text" size="small" @click="item.click">
            <component :is="item.icon" />
          </a-button>
        </a-tooltip>
      </div>
    </div>

    <div v-if="currentMenu" class="content-warp">
      <keep-alive>
        <component :is="currentMenu.component" />
      </keep-alive>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { computed, DefineComponent, FunctionalComponent } from "vue"
import { useStore } from "@/store"
import { SearchMutations } from "@/store/search"
import {
  HistoryOutlined,
  RestOutlined,
  AppstoreOutlined,
  PlusOutlined
} from "@ant-design/icons-vue"
import HomeTopSite from "./HomeTopSite.vue"
import SearchHistory from "./SearchHistory.vue"
import { SettingMutations } from "@/store/setting"
import { Option, PopupSettting } from "@/types"

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
    title: "首页导航",
    icon: AppstoreOutlined,
    component: HomeTopSite,
    actions: [
      {
        title: "添加",
        icon: PlusOutlined
      }
    ]
  },
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

// Vuex
const store = useStore()
const current = computed({
  get: () => store.state.setting.popup.current,
  set: current => updatePopupSetting({ current })
})

// 当前菜单
const currentMenu = computed(() => popupMenu[current.value])

function updatePopupSetting(popup: Option<PopupSettting>) {
  store.commit(SettingMutations.updatePopupSetting, popup)
}

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
    overflow-x: hidden;
    height: calc(100% - @title-h);
  }
}
</style>
