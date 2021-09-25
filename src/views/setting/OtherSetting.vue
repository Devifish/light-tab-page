<template>
  <div class="other-setting">
    <setting-item :lable="t('other.lang')" horizontal>
      <a-select v-model:value="lang" style="width: 100px">
        <a-select-option v-for="(value, key) in languages" :value="key" :key="key">
          {{ value }}
        </a-select-option>
      </a-select>
    </setting-item>

    <setting-item :lable="t('other.backup.text')">
      <div class="backup-btn-warp">
        <a-button @click="exportBackupFile">
          <template #icon>
            <DownloadOutlined />
          </template>

          {{ t("other.backup.export") }}
        </a-button>
        <a-upload
          accept="application/json"
          :show-upload-list="false"
          :customRequest="importBackupFile"
        >
          <a-button>
            <template #icon>
              <UploadOutlined />
            </template>

            {{ t("other.backup.import") }}
          </a-button>
        </a-upload>
      </div>
    </setting-item>
  </div>
</template>

<script lang="ts" setup>
import SettingItem from "@/components/SettingItem.vue"
import { useStore } from "@/store"
import { SettingActions, SettingMutations } from "@/store/setting"
import { computed, ref } from "vue"
import { useI18n } from "vue-i18n"
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons-vue"

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

async function importBackupFile(e) {
  try {
    const file: File = e.file
    await store.dispatch(SettingActions.importSetting, file)
  } catch (e) {
    console.log(e)
  }

  // 导入成功刷新页面
  location.reload()
}

function exportBackupFile() {
  store.dispatch(SettingActions.exportSetting)
}
</script>

<style lang="less">
.other-setting {
  .backup-btn-warp {
    display: flex;
    justify-content: space-around;

    button {
      width: 156px;
    }
  }
}
</style>
