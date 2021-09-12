<template>
  <div class="top-site-setting-warp">
    <setting-item lable="图标大小" horizontal>
      <a-slider
        v-model:value="topSiteSetting.iconSize"
        :min="16"
        :max="topSiteSetting.boardSize"
        :step="8"
        :tipFormatter="toPixel"
        style="width: 200px"
      />
    </setting-item>

    <setting-item lable="底板大小" horizontal>
      <a-slider
        v-model:value="topSiteSetting.boardSize"
        :min="16"
        :max="96"
        :step="8"
        :tipFormatter="toPixel"
        style="width: 200px"
      />
    </setting-item>
    <setting-item lable="底板颜色" horizontal>
      <color-radio
        v-model:value="topSiteSetting.boardColor"
        :colors="['#FFF', '#00A4EF', '#7FBA00', '#F25022', '#FFB900', '#1F1F1F']"
        style="width: 215px"
      />
    </setting-item>
    <setting-item lable="底板不透明度" horizontal>
      <a-slider
        v-model:value="topSiteSetting.boardOpacity"
        :step="0.01"
        :max="1"
        :tipFormatter="toPercent"
        style="width: 200px"
      />
    </setting-item>
    <setting-item lable="底板圆角" horizontal>
      <a-slider
        v-model:value="topSiteSetting.boardRadius"
        :max="topSiteSetting.boardSize / 2"
        :tipFormatter="toPixel"
        style="width: 200px"
      />
    </setting-item>
  </div>
</template>

<script lang="ts" setup>
import { TopSiteSetting, Option } from "@/types"
import { toPixel, toPercent } from "@/utils/format"
import { useStore } from "@/store"
import { SettingMutations } from "@/store/setting"
import { deepComputed } from "@/utils/common"

const store = useStore()
const topSiteSetting = deepComputed(
  () => store.state.setting.topSite,
  updateTopSiteSetting,
  "row",
  "col",
  "gap"
)

function updateTopSiteSetting(data: Option<TopSiteSetting>) {
  store.commit(SettingMutations.updateTopSiteSetting, data)
}
</script>
