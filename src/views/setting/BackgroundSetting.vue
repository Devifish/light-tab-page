<template>
  <div class="background-setting">
    <div>
      <span class="lable-text">背景设置</span>
      <a-radio-group
        :value="viewSetting.backgroundType"
        @change="onBackgroundTypeChange"
        style="width: 100%"
      >
        <a-radio :value="BackgroundType.None">无</a-radio>
        <a-radio :value="BackgroundType.Local" disabled>本地图片</a-radio>
        <a-radio :value="BackgroundType.Bing" disabled>Bing每日壁纸</a-radio>
      </a-radio-group>
    </div>
    <div class="upload-background" v-show="viewSetting.backgroundType === BackgroundType.Local">
      <span class="lable-text">上传背景</span>
      <a-upload list-type="picture-card">
        <div>
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
import { BackgroundType, ViewSetting } from "@/types";

const store = useStore();
const viewSetting = computed<ViewSetting>(() => store.getters["setting/getViewSetting"]);

function onBackgroundTypeChange(e) {
  store.commit("setting/updateViewSetting", {
    backgroundType: e.target.value,
  });
}
</script>

<style lang="less">
.background-setting {
  .upload-background {
    margin-top: 8px;
  }
}
</style>
