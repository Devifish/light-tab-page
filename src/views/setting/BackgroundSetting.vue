<template>
  <div class="background-setting">
    <a-row type="flex" justify="space-between" align="middle">
      <a-col>
        <span class="lable-text">壁纸设置</span>
      </a-col>
      <a-col>
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
      </a-col>
    </a-row>

    <div class="upload-layout" v-show="backgroundType === BackgroundType.Local">
      <span class="lable-text">上传壁纸</span>
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
    </div>

    <template v-if="backgroundType !== BackgroundType.None">
      <div>
        <span class="lable-text">模糊强度</span>
        <a-slider v-model:value="blur" :max="48" :tipFormatter="value => `${value}px`" />
      </div>

      <div>
        <span class="lable-text">遮罩不透明度</span>
        <a-slider
          v-model:value="maskOpacity"
          :step="0.01"
          :max="1"
          :tipFormatter="value => `${Math.round(value * 100)}%`"
        />
      </div>

      <a-row type="flex" justify="space-between" align="middle">
        <a-col>
          <span class="lable-text">在深色模式下使壁纸更暗</span>
        </a-col>
        <a-col>
          <a-switch v-model:checked="autoOpacity" />
        </a-col>
      </a-row>
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
