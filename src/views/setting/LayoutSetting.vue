<template>
  <setting-item lable="导航栏" horizontal>
    <a-switch v-model:checked="topSiteSetting.enable" v-permis="Permis.topSite" />
  </setting-item>
  <a-alert
    v-if="!topSiteSetting.enable"
    message="导航栏数据来源于最近浏览，开启需要相关权限"
    type="warning"
    banner
  />

  <template v-if="topSiteSetting.enable">
    <setting-item lable="行/列数">
      <a-slider
        v-model:value="topSiteSetting.col"
        :min="4"
        :max="8"
        :marks="{ 4: '4列', 6: '6列', 8: '8列' }"
        dots
      />
      <a-slider
        v-model:value="topSiteSetting.row"
        :min="1"
        :max="3"
        :marks="{ 1: '1行', 2: '2行', 3: '3行' }"
      />
    </setting-item>

    <setting-item lable="间距">
      <a-slider v-model:value="topSiteSetting.gap" :min="0" :max="48" :tipFormatter="toPixel" />
    </setting-item>
  </template>

  <setting-item lable="对齐">
    <a-radio-group v-model:value="layoutSetting.align" button-style="solid">
      <a-radio :value="AlignType.searchCenter">仅搜索居中</a-radio>
      <a-radio :value="AlignType.overallCenter">整体居中(搜索+导航)</a-radio>
    </a-radio-group>
  </setting-item>
</template>

<script lang="ts" setup>
import { useStore } from "@/store"
import { deepComputed, otherKeys } from "@/utils/common"
import { SettingMutations } from "@/store/setting"
import { TopSiteSetting, Option, LayoutSetting, AlignType } from "@/types"
import { toPixel } from "@/utils/format"
import { Permis } from "@/plugins/extension"

const store = useStore()
const topSiteSetting = deepComputed(
  () => store.state.setting.topSite,
  updateTopSiteSetting,
  ...otherKeys(store.state.setting.topSite, "col", "row", "gap", "enable")
)
const layoutSetting = deepComputed(() => store.state.setting.layout, updateLayoutSetting)

function updateTopSiteSetting(data: Option<TopSiteSetting>) {
  store.commit(SettingMutations.updateTopSiteSetting, data)
}

function updateLayoutSetting(data: Option<LayoutSetting>) {
  store.commit(SettingMutations.updateLayoutSetting, data)
}
</script>
