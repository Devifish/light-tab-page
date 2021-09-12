<template>
  <div class="background-setting">
    <setting-item lable="壁纸设置" horizontal>
      <a-radio-group v-model:value="background.type" button-style="solid">
        <a-radio-button :value="BackgroundType.None">无</a-radio-button>
        <a-radio-button :value="BackgroundType.Local">本地图片</a-radio-button>
        <a-radio-button
          :value="BackgroundType.Bing"
          :disabled="!isExtension"
          v-permis="Permis.bing"
        >
          Bing每日壁纸
        </a-radio-button>
      </a-radio-group>
    </setting-item>

    <setting-item
      v-if="background.type === BackgroundType.Local"
      class="upload-layout"
      lable="上传壁纸"
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
      <setting-item lable="模糊强度">
        <a-slider v-model:value="background.blur" :max="48" :tipFormatter="toPixel" />
      </setting-item>

      <setting-item lable="遮罩不透明度">
        <a-slider
          v-model:value="background.maskOpacity"
          :step="0.01"
          :max="1"
          :tipFormatter="toPercent"
        />
      </setting-item>

      <setting-item lable="在深色模式下使壁纸更暗" horizontal>
        <a-switch v-model:checked="background.autoOpacity" />
      </setting-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { watch } from "vue"
import { PlusOutlined } from "@ant-design/icons-vue"
import { BackgroundSetting, BackgroundType } from "@/types"
import { isExtension, Permis } from "@/plugins/extension"
import { toPixel, toPercent } from "@/utils/format"
import { useStore } from "@/store"
import { SettingActions, SettingMutations } from "@/store/setting"
import { deepComputed } from "@/utils/common"

const store = useStore()
const background = deepComputed(() => store.state.setting.background, updateBackgroundSetting)

function uploadBackgroundImage(e) {
  store.dispatch(SettingActions.uploadBackgroundImage, e.file)
}

function updateBackgroundSetting(value: BackgroundSetting) {
  store.commit(SettingMutations.updateBackgroundSetting, value)
}

// 监听到背景类型为Bing则拉取壁纸
watch(
  () => background.type,
  type => {
    if (type === BackgroundType.Bing) {
      store.dispatch(SettingActions.loadBingDailyWallpaper)
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
