<template>
  <setting-item horizontal>
    <template #lable>
      <span>{{ t("layout.topSiteBar") }}</span>
      <icon-tooltip v-if="!topSite.enable" :title="t('layout.topSiteBarTip')" type="warn" />
    </template>

    <a-switch
      v-model:checked="topSite.enable"
      :disabled="!isExtension"
      v-permis="Permis.topSite"
    />
  </setting-item>

  <template v-if="topSite.enable">
    <setting-item :lable="t('layout.colRow')">
      <a-slider
        v-model:value="topSite.col"
        :min="4"
        :max="8"
        :marks="{ 4: '4列', 6: '6列', 8: '8列' }"
        dots
      />
      <a-slider
        v-model:value="topSite.row"
        :min="1"
        :max="3"
        :marks="{ 1: '1行', 2: '2行', 3: '3行' }"
      />
    </setting-item>

    <setting-item :lable="t('layout.space')">
      <a-slider v-model:value="topSite.gap" :min="0" :max="48" :tipFormatter="toPixel" />
    </setting-item>
  </template>

  <setting-item :lable="t('layout.align.text')">
    <a-radio-group v-model:value="layout.align" button-style="solid">
      <a-radio :value="AlignType.searchCenter">{{ t("layout.align.searchCenter") }}</a-radio>
      <a-radio :value="AlignType.overallCenter">{{ t("layout.align.overallCenter") }}</a-radio>
    </a-radio-group>
  </setting-item>
</template>

<script lang="ts" setup>
import { useSettingStore } from "@/store"
import { AlignType } from "@/types/setting"
import { toPixel } from "@/utils/format"
import { isExtension, Permis } from "@/plugins/extension"
import { useI18n } from "vue-i18n"
import { storeToRefs } from "pinia"

const { t } = useI18n()
const settingStore = useSettingStore()
const { topSite, layout } = storeToRefs(settingStore)
</script>
