<template>
  <setting-item lable="导航栏" horizontal>
    <a-switch :checked="true" disabled />
  </setting-item>

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

<script lang="ts" setup>
import { useStore } from "@/store"
import { deepComputed, otherKeys } from "@/utils/common"
import { SettingMutations } from "@/store/setting"
import { TopSiteSetting, Option } from "@/types"
import { toPixel } from "@/utils/format"

const store = useStore()
const topSiteSetting = deepComputed(
  () => store.state.setting.topSite,
  updateTopSiteSetting,
  ...otherKeys(store.state.setting.topSite, "col", "row", "gap")
)

function updateTopSiteSetting(data: Option<TopSiteSetting>) {
  store.commit(SettingMutations.updateTopSiteSetting, data)
}
</script>
