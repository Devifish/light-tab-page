<template>
  <div class="other-setting">
    <setting-item :lable="t('other.lang')" horizontal>
      <a-select v-model:value="lang" style="width: 100px">
        <a-select-option v-for="(value, key) in languages" :value="key" :key="key">
          {{ value }}
        </a-select-option>
      </a-select>
    </setting-item>
  </div>
</template>

<script lang="ts" setup>
import SettingItem from "@/components/SettingItem.vue"
import { useStore } from "@/store"
import { SettingMutations } from "@/store/setting"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"

const { t, availableLocales } = useI18n()
const store = useStore()

const languages = ref<Record<string, any>>({
  auto: computed(() => t("common.auto")),
  ...Object.fromEntries(availableLocales.map(item => [item, t("lang", item, { locale: item })]))
})

const lang = computed({
  get: () => store.state.setting.lang,
  set: lang => store.commit(SettingMutations.updateLanguage, lang)
})
</script>
