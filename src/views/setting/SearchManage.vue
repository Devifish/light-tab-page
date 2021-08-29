<template>
  <a-list class="search-list" item-layout="horizontal" :data-source="searchEngines">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta :description="item.description">
          <template #title>
            <span>
              {{ item.name }}
              <template v-if="defaultEngineKeys.includes(item.id)">(内置)</template>
            </span>
            <a-tag v-if="currentEngine === item.id" color="processing"> 使用中 </a-tag>
            <a-tag v-else-if="useSearchEngines.includes(item.id)" color="success"> 已添加 </a-tag>
          </template>
          <template #avatar>
            <img :src="item.icon" />
          </template>
        </a-list-item-meta>

        <template #actions>
          <a-button
            v-if="!useSearchEngines.includes(item.id)"
            type="link"
            size="small"
            @click="addUseSearchEngines(item.id)"
          >
            添加
          </a-button>
          <a-button
            v-else
            type="link"
            size="small"
            :disabled="currentEngine === item.id"
            @click="removeUseSearchEngines(item.id)"
          >
            移出
          </a-button>
          <a-button
            type="link"
            size="small"
            :disabled="defaultEngineKeys.includes(item.id)"
            @click="deleteSearchEngine(item.id)"
          >
            删除
          </a-button>
        </template>
      </a-list-item>
    </template>

    <template #loadMore>
      <div :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
        <a-button type="text">
          <template #icon>
            <plus-outlined />
          </template>
          创建
        </a-button>
      </div>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import { SearchEngineData, SearchSetting } from "@/types";
import { PlusOutlined } from "@ant-design/icons-vue";
import { DEFAULT_SEARCH_ENGINES } from "@/store/search";

// Vuex
const store = useStore();
const searchSetting = computed<SearchSetting>(() => store.getters["search/getSearchSetting"]),
  currentEngine = computed(() => searchSetting.value.currentEngine!),
  useSearchEngines = computed(() => searchSetting.value.useSearchEngines!),
  searchEngines = computed(() => Object.values(store.getters["search/getSearchEngines"]));

const defaultEngineKeys = Object.keys(DEFAULT_SEARCH_ENGINES);
const currentDragEngineId = ref<string>();

function onEngineDragenter(e, moveId: string) {
  e.preventDefault();

  const currentId = currentDragEngineId.value;
  if (currentId && moveId !== currentId) {
    const temp = Array.from(useSearchEngines.value);
    const currentIndex = temp.indexOf(currentId);
    const moveIndex = temp.indexOf(moveId);

    temp.splice(currentIndex, 1);
    temp.splice(moveIndex, 0, currentId);

    store.commit("search/updateSearchSetting", {
      useSearchEngines: temp,
    });
  }
}

function addUseSearchEngines(engineId: string) {
  const temp = new Set(useSearchEngines.value);
  temp.add(engineId);

  store.commit("search/updateSearchSetting", {
    useSearchEngines: Array.from(temp),
  });
}

function removeUseSearchEngines(engineId: string) {
  const temp = new Set(useSearchEngines.value);
  temp.delete(engineId);

  store.commit("search/updateSearchSetting", {
    useSearchEngines: Array.from(temp),
  });
}

function deleteSearchEngine(engineId: string) {}
</script>

<style lang="less">
.search-list {
  .ant-list-item-meta-title {
    .ant-tag {
      margin-left: 8px;
    }
  }

  .ant-list-item-meta-avatar {
    margin-top: 12px;

    img {
      height: 32px;
      width: 64px;
      object-fit: contain;
    }
  }

  .ant-list-item-action {
    margin-left: 0;

    li {
      padding: 0;
    }

    span {
      font-size: 12px;
    }
  }
}
</style>
