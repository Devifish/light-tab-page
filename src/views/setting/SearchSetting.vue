<template>
  <div class="search-setting">
    <setting-item horizontal>
      <template #lable>
        <span>{{ t("search.engine") }}</span>

        <a-tooltip title="管理搜索引擎">
          <a-button
            class="engine-setting"
            type="text"
            shape="circle"
            size="small"
            @click="manageVisible = true"
          >
            <setting-outlined />
          </a-button>
        </a-tooltip>
      </template>

      <a-select v-model:value="searchSetting.currentEngine" style="width: 90px">
        <a-select-option v-for="(value, key) in searchEngines" :value="key" :key="key">
          {{ value.name }}
        </a-select-option>
      </a-select>
    </setting-item>

    <setting-item :lable="t('search.suggestApi')" horizontal>
      <a-select
        v-model:value="searchSetting.suggestion"
        :disabled="!isExtension"
        v-permis="Permis.suggestion"
        style="width: 100px"
      >
        <a-select-option :value="SearchSuggestion.none"> 不使用 </a-select-option>
        <a-select-option :value="SearchSuggestion.baidu"> 百度 API </a-select-option>
        <a-select-option :value="SearchSuggestion.bing"> Bing API </a-select-option>
        <a-select-option :value="SearchSuggestion.google"> Google API </a-select-option>
      </a-select>
    </setting-item>
    <a-alert
      v-if="searchSetting.suggestion === SearchSuggestion.none"
      :message="t('search.suggestApiTip')"
      type="warning"
      banner
    />

    <setting-item :lable="t('search.searchRound')">
      <a-slider v-model:value="searchSetting.searchInputRadius" :max="22" :tipFormatter="toPixel" />
    </setting-item>

    <setting-item :lable="t('search.newTabOpen')" horizontal>
      <a-switch v-model:checked="isOpenPageByBlank" />
    </setting-item>

    <setting-item :lable="t('search.showEngineIcon')" horizontal>
      <a-switch v-model:checked="searchSetting.showEngineIcon" />
    </setting-item>

    <setting-item :lable="t('search.showEngineSelet')" horizontal>
      <a-switch v-model:checked="searchSetting.showEngineSelect" />
    </setting-item>
  </div>

  <a-drawer v-model:visible="manageVisible" title="管理搜索引擎" :width="400" destroy-on-close>
    <search-manage />
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import { SettingOutlined } from "@ant-design/icons-vue"
import { OpenPageTarget, SearchEngineData, SearchSetting, SearchSuggestion, Option } from "@/types"
import SearchManage from "./SearchManage.vue"
import { Permis, isExtension } from "@/plugins/extension"
import { toPixel } from "@/utils/format"
import { useStore } from "@/store"
import { SearchGetters } from "@/store/search"
import { deepComputed } from "@/utils/common"
import { SettingMutations } from "@/store/setting"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const store = useStore()

const searchEngines = computed<SearchEngineData>(
  () => store.getters[SearchGetters.getUseSearchEngines]
)
const searchSetting = deepComputed(
  () => store.state.setting.search,
  updateSearchSetting,
  "openPageTarget"
)

// Ref
const manageVisible = ref(false)

// 是否在新标签页中打开
const isOpenPageByBlank = computed({
  get: () => store.state.setting.search.openPageTarget === OpenPageTarget.Blank,
  set: isOpenPageByBlank =>
    updateSearchSetting({
      openPageTarget: isOpenPageByBlank ? OpenPageTarget.Blank : OpenPageTarget.Self
    })
})

function updateSearchSetting(data: Option<SearchSetting>) {
  store.commit(SettingMutations.updateSearchSetting, data)
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
