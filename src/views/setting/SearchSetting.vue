<template>
  <div class="search-setting">
    <setting-item horizontal>
      <template #lable>
        <span>{{ t("search.engine") }}</span>
        <icon-tooltip class="engine-setting" title="管理搜索引擎" @click="manageVisible = true">
          <setting-outlined />
        </icon-tooltip>
      </template>

      <a-select v-model:value="setting.currentEngine" style="width: 90px">
        <a-select-option v-for="(value, key) in useSearchEngines" :value="key" :key="key">
          {{ value.name }}
        </a-select-option>
      </a-select>
    </setting-item>

    <setting-item horizontal>
      <template #lable>
        <span>{{ t("search.suggestApi") }}</span>
        <icon-tooltip
          v-if="setting.suggestion === SearchSuggestion.none"
          :title="t('search.suggestApiTip')"
          type="warn"
        />
      </template>

      <a-select
        v-model:value="setting.suggestion"
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

    <setting-item :lable="t('search.searchRound')">
      <a-slider v-model:value="setting.searchInputRadius" :max="22" :tip-formatter="toPixel" />
    </setting-item>

    <setting-item :lable="t('search.newTabOpen')" horizontal>
      <a-switch v-model:checked="isOpenPageByBlank" />
    </setting-item>

    <setting-item :lable="t('search.showEngineIcon')" horizontal>
      <a-switch v-model:checked="setting.showEngineIcon" />
    </setting-item>

    <setting-item :lable="t('search.showEngineSelet')" horizontal>
      <a-switch v-model:checked="setting.showEngineSelect" />
    </setting-item>
  </div>

  <a-drawer v-model:visible="manageVisible" title="管理搜索引擎" :width="400" destroy-on-close>
    <search-manage />
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue"
import { SettingOutlined } from "@ant-design/icons-vue"
import { OpenPageTarget, SearchSuggestion } from "@/types"
import SearchManage from "./SearchManage.vue"
import { Permis, isExtension } from "@/plugins/extension"
import { toPixel } from "@/utils/format"
import { useSettingStore, useSearchStore } from "@/store"
import { useI18n } from "vue-i18n"
import IconTooltip from "@/components/IconTooltip.vue"
import { storeToRefs } from "pinia"

const { t } = useI18n()
const settingStore = useSettingStore()
const searchStore = useSearchStore()
const { search: setting } = storeToRefs(settingStore)
const { useSearchEngines } = storeToRefs(searchStore)

// Ref
const manageVisible = ref(false)
const isOpenPageByBlank = computed({
  get: () => settingStore.search.openPageTarget === OpenPageTarget.Blank,
  set: isOpenPageByBlank => {
    const openPageTarget = isOpenPageByBlank ? OpenPageTarget.Blank : OpenPageTarget.Self
    setting.value.openPageTarget = openPageTarget
  }
})
</script>

<style lang="less">
.search-setting {
  .engine-setting {
    color: var(--primary-color);
    margin-left: 4px;
    font-size: 12px;
  }
}
</style>
