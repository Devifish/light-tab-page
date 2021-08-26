<template>
  <div class="background-setting">
    <div>
      <h4>背景设置</h4>
      <a-radio-group
        :value="viewSetting.backgroundType"
        @change="onBackgroundTypeChange"
      >
        <a-radio :value="BackgroundType.None">无</a-radio>
        <a-radio :value="BackgroundType.Local">本地图片</a-radio>
        <a-radio :value="BackgroundType.Bing" disabled>Bing每日壁纸（Todo）</a-radio>
      </a-radio-group>
    </div>
    <div
      class="upload-background"
      v-show="viewSetting.backgroundType === BackgroundType.Local"
    >
      <h4>上传背景</h4>
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
const viewSetting = computed<ViewSetting>(() => {
  return store.getters["setting/getViewSetting"];
});

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
