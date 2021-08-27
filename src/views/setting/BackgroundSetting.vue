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
      <span class="lable-text">选择壁纸</span>
      <a-upload
        class="background-uploader"
        list-type="picture-card"
        :show-upload-list="false"
        :customRequest="uploadBackgroundImage"
      >
        <img v-if="backgroundUrl" :src="backgroundUrl" alt="avatar" />
        <div v-else>
          <plus-outlined />
        </div>
      </a-upload>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { PlusOutlined } from "@ant-design/icons-vue";
import { BackgroundSetting, BackgroundType, ViewSetting } from "@/types";

const store = useStore();
const background = computed<BackgroundSetting>(() => store.getters["setting/getBackgroundSetting"]);

// 背景类型
const backgroundType = computed({
  get: () => background.value.type!,
  set: (type) => store.commit("setting/updateBackgroundSetting", { type }),
});

// 背景路径
const backgroundUrl = computed(() => background.value.url);

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
        width: 96px;
        height: 96px;

        object-fit: cover;
        object-position: center;
      }
    }
  }
}
</style>
