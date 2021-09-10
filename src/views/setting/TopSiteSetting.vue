<template>
  <div class="top-site-setting-warp">
    <setting-item lable="开启导航栏" horizontal>
      <a-switch :checked="true" disabled />
    </setting-item>

    <setting-item lable="行/列数">
      <a-slider
        v-model:value="topSiteSetting.col"
        :min="4"
        :max="8"
        :marks="{ 4: '4列', 6: '6列', 8: '8列' }"
        :step="2"
      />
      <a-slider
        v-model:value="topSiteSetting.row"
        :min="1"
        :max="3"
        :marks="{ 1: '1行', 2: '2行', 3: '3行' }"
      />
    </setting-item>

    <setting-item lable="图标大小" horizontal>
      <a-slider
        v-model:value="topSiteSetting.iconSize"
        :step="8"
        :max="topSiteSetting.boardSize"
        style="width: 200px"
      />
    </setting-item>

    <setting-item lable="底板大小" horizontal>
      <a-slider v-model:value="topSiteSetting.boardSize" :step="8" :max="96" style="width: 200px" />
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
        style="width: 200px"
      />
    </setting-item>
    <setting-item lable="底板圆角" horizontal>
      <a-slider
        v-model:value="topSiteSetting.boardRadius"
        :max="topSiteSetting.boardSize / 2"
        style="width: 200px"
      />
    </setting-item>
    <setting-item lable="间距" horizontal>
      <a-slider v-model:value="topSiteSetting.gap" :min="0" :max="48" style="width: 200px" />
    </setting-item>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue"
import { useStore } from "vuex"
import { SETTING_STORE_KEY } from "@/store/setting"
import { TopSiteSetting } from "@/types"

const settingStore = useStore(SETTING_STORE_KEY)
const topSiteSetting = computed(() => settingStore.state.topSite)

function updateTopSiteSetting(data: TopSiteSetting) {
  settingStore.commit("updateTopSiteSetting", data)
}

// 监听到设置变化则更新数据
watch(topSiteSetting, updateTopSiteSetting, { deep: true })
</script>
