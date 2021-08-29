<template>
  <div class="background-setting">
    <div>
      <span class="lable-text">壁纸设置</span>
      <a-radio-group v-model:value="backgroundType" style="width: 100%">
        <a-radio :value="BackgroundType.None">无</a-radio>
        <a-radio :value="BackgroundType.Local">本地图片</a-radio>
        <a-radio :value="BackgroundType.Bing" disabled>Bing每日壁纸</a-radio>
      </a-radio-group>
    </div>

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
        <span class="lable-text">遮罩透明度</span>
        <a-slider
          v-model:value="maskOpacity"
          :step="0.01"
          :max="1"
          :tipFormatter="(value) => `${Math.round(value * 100)}%`"
        />
      </div>

      <div>
        <span class="lable-text">模糊强度</span>
        <a-slider v-model:value="blur" :max="48" :tipFormatter="(value) => `${value}px`" />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { PlusOutlined } from "@ant-design/icons-vue";
import { BackgroundSetting, BackgroundType } from "@/types";

const store = useStore();
const background = computed<BackgroundSetting>(() => store.getters["setting/getBackgroundSetting"]);

// 背景类型
const backgroundType = computed<BackgroundType>({
  get: () => background.value.type!,
  set: (type) => store.commit("setting/updateBackgroundSetting", { type }),
});

// 背景路径
const backgroundUrl = computed(() => background.value.url);

const blur = computed({
  get: () => background.value.blur!,
  set: (blur) => store.commit("setting/updateBackgroundSetting", { blur }),
});

const maskOpacity = computed({
  get: () => background.value.maskOpacity!,
  set: (maskOpacity) => store.commit("setting/updateBackgroundSetting", { maskOpacity }),
});

function uploadBackgroundImage(e) {
  store.dispatch("setting/uploadBackgroundImage", e.file);
}
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
