<template>
  <div class="search-setting">
    <a-row type="flex" justify="space-between" align="middle">
      <a-col>
        <span class="lable-text">搜索引擎</span>
        <a-tooltip title="管理搜索引擎">
          <a-button
            class="engine-setting"
            type="text"
            shape="circle"
            size="small"
            @click="searchDrawer.open()"
          >
            <setting-outlined />
          </a-button>
        </a-tooltip>
      </a-col>
      <a-col>
        <a-select v-model:value="currentEngine" style="width: 90px">
          <a-select-option v-for="(value, key) in searchEngines" :value="key" :key="key">
            {{ value.name }}
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>

    <div>
      <span class="lable-text">搜索框圆角</span>
      <a-slider v-model:value="searchInputRadius" :max="22" :tipFormatter="value => `${value}px`" />
    </div>

    <a-row type="flex" justify="space-between" align="middle">
      <a-col>
        <span class="lable-text">在新标签页中打开搜索结果</span>
      </a-col>
      <a-col>
        <a-switch v-model:checked="isOpenPageByBlank" />
      </a-col>
    </a-row>

    <a-row type="flex" justify="space-between" align="middle">
      <a-col>
        <span class="lable-text">在搜索框前添加搜索引擎下拉列表</span>
      </a-col>
      <a-col>
        <a-switch v-model:checked="showEngineSelect" />
      </a-col>
    </a-row>
  </div>

  <common-drawer title="管理搜索引擎" :width="400" :footer="false" ref="searchDrawer">
    <search-manage />
  </common-drawer>
</template>

<script lang="ts" setup>
import { useStore } from "vuex"
import { ref, computed } from "vue"
import { SettingOutlined } from "@ant-design/icons-vue"
import { OpenPageTarget, SearchEngineData } from "@/types"
import SearchManage from "./SearchManage.vue"
import { SEARCH_SETTING_KEY } from "@/store/search"

// Vuex
const searchStore = useStore(SEARCH_SETTING_KEY)
const searchEngines = computed<SearchEngineData>(() => searchStore.getters["getUseSearchEngines"])
const searchSetting = computed(() => searchStore.state.setting)

// Ref
const searchDrawer = ref()

// 当前搜索引擎
const currentEngine = computed({
  get: () => searchSetting.value.currentEngine!,
  set: value => searchStore.commit("updateCurrentEngine", value)
})

// 是否在新标签页中打开
const isOpenPageByBlank = computed({
  get: () => searchSetting.value.openPageTarget === OpenPageTarget.Blank,
  set: (isOpenPageByBlank: boolean) =>
    searchStore.commit("updateSearchSetting", {
      openPageTarget: isOpenPageByBlank ? OpenPageTarget.Blank : OpenPageTarget.Self
    })
})

// 显示搜索引擎下拉列表
const showEngineSelect = computed({
  get: () => searchSetting.value.showEngineSelect,
  set: showEngineSelect => searchStore.commit("updateSearchSetting", { showEngineSelect })
})

// 搜索输入框圆角
const searchInputRadius = computed({
  get: () => searchSetting.value.searchInputRadius,
  set: searchInputRadius => searchStore.commit("updateSearchSetting", { searchInputRadius })
})
</script>

<style lang="less">
@import "ant-design-vue/lib/style/themes/index.less";

.search-setting {
  .engine-setting {
    color: @primary-color;
    margin-left: 4px;
    font-size: 12px;
  }
}
</style>
