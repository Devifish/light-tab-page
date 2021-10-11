<template>
  <setting-item horizontal>
    <template #lable>
      <span>{{ t("layout.topSiteBar") }}</span>
      <icon-tooltip v-if="!topSiteSetting.enable" :title="t('layout.topSiteBarTip')" type="warn" />
    </template>

    <a-switch
      v-model:checked="topSiteSetting.enable"
      :disabled="!isExtension"
      v-permis="Permis.topSite"
    />
  </setting-item>

  <template v-if="topSiteSetting.enable">
    <setting-item :lable="t('layout.colRow')">
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

    <setting-item :lable="t('layout.space')">
      <a-slider v-model:value="topSiteSetting.gap" :min="0" :max="48" :tipFormatter="toPixel" />
    </setting-item>
  </template>

  <setting-item :lable="t('layout.align.text')">
    <a-radio-group v-model:value="layoutSetting.align" button-style="solid">
      <a-radio :value="AlignType.searchCenter">{{ t("layout.align.searchCenter") }}</a-radio>
      <a-radio :value="AlignType.overallCenter">{{ t("layout.align.overallCenter") }}</a-radio>
    </a-radio-group>
  </setting-item>
</template>

<script lang="ts" setup>
import { useStore } from "@/store"
import { deepComputed, otherKeys } from "@/utils/common"
import { SettingMutations } from "@/store/setting"
import { TopSiteSetting, Option, LayoutSetting, AlignType } from "@/types"
import { toPixel } from "@/utils/format"
import { isExtension, Permis } from "@/plugins/extension"
import { useI18n } from "vue-i18n"

const { t } = useI18n()
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
