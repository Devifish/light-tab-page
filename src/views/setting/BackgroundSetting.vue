<template>
  <div class="background-setting">
    <setting-item :lable="t('background.wallpaper.setting')">
      <a-radio-group v-model:value="background.type" button-style="solid">
        <a-radio :value="BackgroundType.None">{{ t("background.wallpaper.none") }}</a-radio>
        <a-radio :value="BackgroundType.Local">{{ t("background.wallpaper.local") }}</a-radio>
        <a-radio :value="BackgroundType.Bing" :disabled="!isExtension" v-permis="Permis.bing">
          {{ t("background.wallpaper.bing") }}
        </a-radio>
      </a-radio-group>
    </setting-item>

    <setting-item
      v-if="background.type === BackgroundType.Local"
      class="upload-layout"
      :lable="t('background.wallpaper.upload')"
    >
      <a-upload
        class="background-uploader"
        list-type="picture-card"
        :show-upload-list="false"
        :customRequest="uploadBackgroundImage"
        accept="image/*"
        style="width: 100%"
      >
        <img v-if="background.url" :src="background.url" alt="avatar" />
        <div v-else>
          <plus-outlined />
        </div>
      </a-upload>
    </setting-item>

    <template v-if="background.type !== BackgroundType.None">
      <setting-item :lable="t('background.blur')">
        <a-slider v-model:value="background.blur" :max="48" :tipFormatter="toPixel" />
      </setting-item>

      <setting-item :lable="t('background.maskOpacity')">
        <a-slider
          v-model:value="background.maskOpacity"
          :step="0.01"
          :max="1"
          :tipFormatter="toPercent"
        />
      </setting-item>

      <setting-item :lable="t('background.wallpaperDark')" horizontal>
        <a-switch v-model:checked="background.autoOpacity" />
      </setting-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { PlusOutlined } from "@ant-design/icons-vue"
import { BackgroundType } from "@/types/setting"
import { isExtension, Permis } from "@/plugins/extension"
import { toPixel, toPercent } from "@/utils/format"
import { useSettingStore } from "@/store"
import { useI18n } from "vue-i18n"
import { storeToRefs } from "pinia"

const { t } = useI18n()
const store = useSettingStore()
const { background } = storeToRefs(store)

function uploadBackgroundImage(e) {
  store.uploadBackgroundImage(e.file)
}

// 监听到背景类型为Bing则拉取壁纸
watch(
  () => background.value.type,
  type => {
    if (type === BackgroundType.Bing) {
      store.loadBingDailyWallpaper()
    }
  }
)
</script>

<style lang="less">
.background-setting {
  .upload-layout {
    margin-top: 8px;

    .background-uploader {
      .ant-upload,
      img {
        width: 100%;
        height: 128px;

        object-fit: cover;
        object-position: center;
      }
    }
  }
}
</style>
