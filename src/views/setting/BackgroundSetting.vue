<template>
  <div class="background-setting">
    <setting-item lable="壁纸设置" horizontal>
      <a-radio-group v-model:value="backgroundType" button-style="solid">
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
      class="upload-layout"
      lable="上传壁纸"
      v-show="backgroundType === BackgroundType.Local"
    >
      <a-upload
        class="background-uploader"
        list-type="picture-card"
        :show-upload-list="false"
        :customRequest="uploadBackgroundImage"
        accept="image/*"
        style="width: 100%"
      >
        <img v-if="backgroundUrl" :src="backgroundUrl" alt="avatar" />
        <div v-else>
          <plus-outlined />
        </div>
      </a-upload>
    </setting-item>

    <template v-if="backgroundType !== BackgroundType.None">
      <setting-item lable="模糊强度">
        <a-slider v-model:value="blur" :max="48" :tipFormatter="value => `${value}px`" />
      </setting-item>

      <setting-item lable="遮罩不透明度">
        <a-slider
          v-model:value="maskOpacity"
          :step="0.01"
          :max="1"
          :tipFormatter="value => `${Math.round(value * 100)}%`"
        />
      </setting-item>

      <setting-item lable="在深色模式下使壁纸更暗" horizontal>
        <a-switch v-model:checked="autoOpacity" />
      </setting-item>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue"
import { useStore } from "vuex"
import { PlusOutlined } from "@ant-design/icons-vue"
import { BackgroundType } from "@/types"
import { SETTING_STORE_KEY } from "@/store/setting"
import { isExtension, Permis } from "@/plugins/extension"

const settingStore = useStore(SETTING_STORE_KEY)
const background = computed(() => settingStore.state.view.background!)

// 背景类型
const backgroundType = computed<BackgroundType>({
  get: () => background.value.type!,
  set: type => settingStore.commit("updateBackgroundSetting", { type })
})

// 背景路径
const backgroundUrl = computed(() => background.value.url)

// 高斯模糊
const blur = computed({
  get: () => background.value.blur!,
  set: blur => settingStore.commit("updateBackgroundSetting", { blur })
})

// 遮罩不透明度
const maskOpacity = computed({
  get: () => background.value.maskOpacity!,
  set: maskOpacity => settingStore.commit("updateBackgroundSetting", { maskOpacity })
})

// 自动透明度
const autoOpacity = computed({
  get: () => background.value.autoOpacity!,
  set: autoOpacity => settingStore.commit("updateBackgroundSetting", { autoOpacity })
})

function uploadBackgroundImage(e) {
  settingStore.dispatch("uploadBackgroundImage", e.file)
}

watch(backgroundType, type => {
  if (type === BackgroundType.Bing) {
    settingStore.dispatch("loadBingDailyWallpaper")
  }
})
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
