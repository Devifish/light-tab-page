<template>
  <div class="top-site-setting">
    <setting-item horizontal>
      <template #lable>
        {{ t("topsite.topSiteData") }}
        <span style="font-size: 10px; color: #a0a0a0">
          ({{ t("topsite.topSiteDataTip", [lastUpdateTime]) }})
        </span>
      </template>

      <a-button :loading="state.syncing" @click="syncBrowserTopSites">
        {{ t("topsite.sync") }}
      </a-button>
    </setting-item>

    <setting-item :lable="t('topsite.iconSize')" horizontal>
      <a-slider
        class="horizontal-item"
        v-model:value="topSite.iconSize"
        :min="16"
        :max="topSite.boardSize"
        :step="8"
        :tipFormatter="toPixel"
      />
    </setting-item>

    <setting-item :lable="t('topsite.boardSize')" horizontal>
      <a-slider
        class="horizontal-item"
        v-model:value="topSite.boardSize"
        :min="16"
        :max="96"
        :step="8"
        :tipFormatter="toPixel"
      />
    </setting-item>
    <setting-item :lable="t('topsite.boardOpacity')" horizontal>
      <a-slider
        class="horizontal-item"
        v-model:value="topSite.boardOpacity"
        :step="0.01"
        :max="1"
        :tipFormatter="toPercent"
      />
    </setting-item>
    <setting-item :lable="t('topsite.boardRound')" horizontal>
      <a-slider
        class="horizontal-item"
        v-model:value="topSite.boardRadius"
        :max="(topSite.boardSize ?? 0) / 2"
        :tipFormatter="toPixel"
      />
    </setting-item>
  </div>
</template>

<script lang="ts" setup>
import { toPixel, toPercent } from "@/utils/format"
import { useSettingStore, useTopSiteStore } from "@/store"
import { computed, reactive } from "vue"
import { sleep } from "@/utils/async"
import dayjs from "@/plugins/dayjs"
import { useI18n } from "vue-i18n"
import { storeToRefs } from "pinia"

const { t } = useI18n()
const settingStore = useSettingStore()
const topSiteStore = useTopSiteStore()
const { topSite } = storeToRefs(settingStore)

const state = reactive({ syncing: false })
const lastUpdateTime = computed(() => dayjs(topSiteStore.lastUpdateTime).fromNow())

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
