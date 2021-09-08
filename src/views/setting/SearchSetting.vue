<template>
  <div class="search-setting">
    <setting-item horizontal>
      <template #lable>
        <span>搜索引擎</span>

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
      </template>

      <a-select v-model:value="currentEngine" style="width: 90px">
        <a-select-option v-for="(value, key) in searchEngines" :value="key" :key="key">
          {{ value.name }}
        </a-select-option>
      </a-select>
    </setting-item>

    <setting-item lable="搜索建议接口" horizontal>
      <a-select v-model:value="suggestion" v-permis="Permis.suggestion" style="width: 100px">
        <a-select-option :value="SearchSuggestion.none"> 不使用 </a-select-option>
        <a-select-option :value="SearchSuggestion.baidu" :disabled="!isExtension">
          百度 API
        </a-select-option>
        <a-select-option :value="SearchSuggestion.bing" :disabled="!isExtension">
          Bing API
        </a-select-option>
        <a-select-option :value="SearchSuggestion.google" :disabled="!isExtension">
          Google API
        </a-select-option>
      </a-select>
    </setting-item>

    <setting-item lable="搜索框圆角">
      <a-slider v-model:value="searchInputRadius" :max="22" :tipFormatter="value => `${value}px`" />
    </setting-item>

    <setting-item lable="在新标签页中打开搜索结果" horizontal>
      <a-switch v-model:checked="isOpenPageByBlank" />
    </setting-item>

    <setting-item lable="在搜索框前添加搜索引擎下拉列表" horizontal>
      <a-switch v-model:checked="showEngineSelect" />
    </setting-item>
  </div>

  <common-drawer title="管理搜索引擎" :width="400" :footer="false" ref="searchDrawer">
    <search-manage />
  </common-drawer>
</template>

<script lang="ts" setup>
import { useStore } from "vuex"
import { ref, computed } from "vue"
import { SettingOutlined } from "@ant-design/icons-vue"
import { OpenPageTarget, SearchEngineData, SearchSetting, SearchSuggestion } from "@/types"
import SearchManage from "./SearchManage.vue"
import { SEARCH_SETTING_KEY } from "@/store/search"
import { Permis, isExtension } from "@/plugins/extension"

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
    updateSearchSetting({
      openPageTarget: isOpenPageByBlank ? OpenPageTarget.Blank : OpenPageTarget.Self
    })
})

// 显示搜索引擎下拉列表
const showEngineSelect = computed({
  get: () => searchSetting.value.showEngineSelect,
  set: showEngineSelect => updateSearchSetting({ showEngineSelect })
})

// 搜索输入框圆角
const searchInputRadius = computed({
  get: () => searchSetting.value.searchInputRadius,
  set: searchInputRadius => updateSearchSetting({ searchInputRadius })
})

// 搜索关键字建议
const suggestion = computed({
  get: () => searchSetting.value.suggestion,
  set: suggestion => updateSearchSetting({ suggestion })
})

function updateSearchSetting(data: SearchSetting) {
  searchStore.commit("updateSearchSetting", data)
}
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
