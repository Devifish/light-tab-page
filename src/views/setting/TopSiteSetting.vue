<template>
  <div class="top-site-setting-warp">
    <setting-item horizontal>
      <template #lable>
        最近浏览数据
        <span style="font-size: 10px; color: #a0a0a0">
          (上次同步: {{ lastUpdateTime ? timediff(lastUpdateTime) : "无" }})
        </span>
      </template>

      <a-button
        :loading="state.syncing"
        :disabled="state.disableSyncBtn"
        @click="syncBrowserTopSites"
      >
        同步
      </a-button>
    </setting-item>

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
        :max="(topSiteSetting.boardSize ?? 0) / 2"
        :tipFormatter="toPixel"
        style="width: 200px"
      />
    </setting-item>
  </div>
</template>

<script lang="ts" setup>
import { TopSiteSetting, Option } from "@/types"
import { toPixel, toPercent, timediff, DAY } from "@/utils/format"
import { useStore } from "@/store"
import { SettingMutations } from "@/store/setting"
import { deepComputed } from "@/utils/common"
import { computed, reactive } from "vue"
import { TopSiteActions } from "@/store/top-site"
import { sleep } from "@/utils/async"

const store = useStore()
const lastUpdateTime = computed(() => store.state.topSite.lastUpdateTime)
const topSiteSetting = deepComputed(
  () => store.state.setting.topSite,
  updateTopSiteSetting,
  "row",
  "col",
  "gap"
)

const now = Date.now()
const state = reactive({
  syncing: false,
  disableSyncBtn: computed(() => (now - (lastUpdateTime.value ?? 0)) / DAY <= 1)
})

function updateTopSiteSetting(data: Option<TopSiteSetting>) {
  store.commit(SettingMutations.updateTopSiteSetting, data)
}

/**
 * 同步浏览器最近浏览
 */
async function syncBrowserTopSites() {
  state.syncing = true
  await sleep(1000) // 提升loading体验

  await store.dispatch(TopSiteActions.syncBrowserTopSites)
  state.syncing = false
}
</script>
