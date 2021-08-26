<template>
  <div class="search-setting">
    <a-row type="flex" justify="space-between" align="middle">
      <a-col>
        <span class="lable-text">搜索引擎</span>
        <a-tooltip title="管理搜索引擎" v-if="false">
          <a-button
            class="engine-setting"
            type="text"
            shape="circle"
            size="small"
            @click="settingDrawer.open()"
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
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { SettingOutlined } from "@ant-design/icons-vue";
import { OpenPageTarget, SearchEngineData, SearchSetting } from "@/types";

// Vuex
const store = useStore();
const searchEngines = computed<SearchEngineData>(() => store.getters["search/getSearchEngines"]);
const searchSetting = computed<SearchSetting>(() => store.getters["search/getSearchSetting"]);

const currentEngine = computed({
  get: () => searchSetting.value.currentEngine!,
  set: (value) => store.commit("search/updateCurrentEngine", value),
});
const isOpenPageByBlank = computed({
  get: () => searchSetting.value.openPageTarget === OpenPageTarget.Blank,
  set: (isOpenPageByBlank: boolean) =>
    store.commit("search/updateSearchSetting", <SearchSetting>{
      openPageTarget: isOpenPageByBlank ? OpenPageTarget.Blank : OpenPageTarget.Self,
    }),
});
const showEngineSelect = computed({
  get: () => searchSetting.value.showEngineSelect,
  set: (showEngineSelect) =>
    store.commit("search/updateSearchSetting", <SearchSetting>{ showEngineSelect }),
});
const searchInputRadius = computed({
  get: () => searchSetting.value.searchInputRadius,
  set: (searchInputRadius) =>
    store.commit("search/updateSearchSetting", <SearchSetting>{ searchInputRadius }),
});
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
