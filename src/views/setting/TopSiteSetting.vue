<template>
  <div class="top-site-setting">
    <setting-item horizontal>
      <template #lable>
        {{ t("topsite.topSiteData") }}
        <span style="font-size: 10px; color: #a0a0a0">
          ({{
            t("topsite.topSiteDataTip", [lastUpdateTime ? dayjs(lastUpdateTime).fromNow() : "无"])
          }})
        </span>
      </template>

      <a-button :loading="state.syncing" @click="syncBrowserTopSites">
        {{ t("topsite.sync") }}
      </a-button>
    </setting-item>

    <setting-item :lable="t('topsite.iconSize')" horizontal>
      <a-slider
        class="horizontal-item"
        v-model:value="topSiteSetting.iconSize"
        :min="16"
        :max="topSiteSetting.boardSize"
        :step="8"
        :tipFormatter="toPixel"
      />
    </setting-item>

    <setting-item :lable="t('topsite.boardSize')" horizontal>
      <a-slider
        class="horizontal-item"
        v-model:value="topSiteSetting.boardSize"
        :min="16"
        :max="96"
        :step="8"
        :tipFormatter="toPixel"
      />
    </setting-item>
    <setting-item :lable="t('topsite.boardColor')" horizontal>
      <color-radio
        v-model:value="topSiteSetting.boardColor"
        :colors="['#FFF', '#00A4EF', '#7FBA00', '#F25022', '#FFB900', '#1F1F1F']"
        style="width: 215px"
      />
    </setting-item>
    <setting-item :lable="t('topsite.boardOpacity')" horizontal>
      <a-slider
        class="horizontal-item"
        v-model:value="topSiteSetting.boardOpacity"
        :step="0.01"
        :max="1"
        :tipFormatter="toPercent"
      />
    </setting-item>
    <setting-item :lable="t('topsite.boardRound')" horizontal>
      <a-slider
        class="horizontal-item"
        v-model:value="topSiteSetting.boardRadius"
        :max="(topSiteSetting.boardSize ?? 0) / 2"
        :tipFormatter="toPixel"
      />
    </setting-item>
  </div>
</template>

<script lang="ts" setup>
import { TopSiteSetting, Option } from "@/types"
import { toPixel, toPercent } from "@/utils/format"
import { useSettingStore, useTopSiteStore } from "@/store"
import { deepComputed } from "@/utils/common"
import { computed, reactive } from "vue"
import { sleep } from "@/utils/async"
import dayjs from "@/plugins/dayjs"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
const settingStore = useSettingStore()
const topSiteStore = useTopSiteStore()

const lastUpdateTime = computed(() => topSiteStore.lastUpdateTime)
const topSiteSetting = deepComputed(
  () => settingStore.topSite,
  updateTopSiteSetting,
  "row",
  "col",
  "gap"
)

const state = reactive({
  syncing: false
})

function updateTopSiteSetting(data: Option<TopSiteSetting>) {
  settingStore.updateTopSiteSetting(data)
}

/**
 * 同步浏览器最近浏览
 */
async function syncBrowserTopSites() {
  state.syncing = true
  await sleep(1000) // 提升loading体验

  await topSiteStore.syncBrowserTopSites()
  state.syncing = false
}
</script>

<style lang="less">
.top-site-setting {
  .horizontal-item {
    width: 210px;
  }
}
</style>
