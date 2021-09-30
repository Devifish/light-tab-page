<template>
  <a-list class="search-list">
    <a-list-item v-for="item of searchEngines" :key="item.id">
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
          v-if="!defaultEngineKeys.includes(item.id)"
          type="link"
          size="small"
          :disabled="currentEngine === item.id"
          @click="deleteSearchEngine(item.id)"
        >
          删除
        </a-button>
      </template>
    </a-list-item>

    <template #loadMore>
      <div v-if="addEngineState.show" class="add-engine-layout">
        <a-form :model="addEngineState" layout="vertical">
          <a-form-item label="搜索引擎名称" v-bind="validateInfos.name">
            <a-input v-model:value="addEngineState.name" placeholder="名称" />
          </a-form-item>
          <a-form-item label="图标URL" name="icon" v-bind="validateInfos.icon">
            <a-input v-model:value="addEngineState.icon" placeholder="图标URL" />
          </a-form-item>
          <a-form-item label="描述" name="description">
            <a-input v-model:value="addEngineState.description" placeholder="描述" />
          </a-form-item>
          <a-form-item
            label="地址URL (用 {searchText} 代替搜索词)"
            name="url"
            v-bind="validateInfos.url"
          >
            <a-textarea v-model:value="addEngineState.url" placeholder="地址URL" :rows="3" />
          </a-form-item>
        </a-form>
        <div class="btn-list">
          <a-button type="primary" @click="addSearchEngine"> 保存 </a-button>
          <a-button @click="addEngineState.show = false"> 取消 </a-button>
        </div>
      </div>
      <div
        v-else
        :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
      >
        <a-button type="text" @click="addEngineState.show = true">
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
import { ref, reactive, computed } from "vue"
import { PlusOutlined } from "@ant-design/icons-vue"
import { DEFAULT_SEARCH_ENGINES, SearchMutations } from "@/store/search"
import { Option, SearchEngineItem, SearchSetting } from "@/types"
import { Form } from "ant-design-vue"
import { useStore } from "@/store"
import { SettingMutations } from "@/store/setting"

// Vuex
const { state, commit } = useStore()
const currentEngine = computed(() => state.setting.search.currentEngine!),
  useSearchEngines = computed(() => state.setting.search.useSearchEngines!),
  searchEngines = computed(() => Object.values(state.search.searchEngines))

const defaultEngineKeys = Object.keys(DEFAULT_SEARCH_ENGINES)
const currentDragEngineId = ref<string>()

const addEngineState = reactive({
  show: false,
  name: "",
  url: "",
  icon: "",
  description: ""
})

const rules = reactive({
  name: [{ required: true, message: "请输入名称" }],
  icon: [{ required: true, message: "请输入图标URL", type: "url" }],
  url: [{ required: true, message: "请输入地址URL", type: "url" }]
})

const { validate, resetFields, validateInfos } = Form.useForm(addEngineState, rules)

function onEngineDragenter(e, moveId: string) {
  e.preventDefault()

  const currentId = currentDragEngineId.value
  if (currentId && moveId !== currentId) {
    const temp = Array.from(useSearchEngines.value)
    const currentIndex = temp.indexOf(currentId)
    const moveIndex = temp.indexOf(moveId)

    temp.splice(currentIndex, 1)
    temp.splice(moveIndex, 0, currentId)

    updateSearchSetting({
      useSearchEngines: temp
    })
  }
}

function addUseSearchEngines(engineId: string) {
  const temp = new Set(useSearchEngines.value)
  temp.add(engineId)

  updateSearchSetting({
    useSearchEngines: Array.from(temp)
  })
}

function removeUseSearchEngines(engineId: string) {
  const temp = new Set(useSearchEngines.value)
  temp.delete(engineId)

  updateSearchSetting({
    useSearchEngines: Array.from(temp)
  })
}

function updateSearchSetting(data: Option<SearchSetting>) {
  commit(SettingMutations.updateSearchSetting, data)
}

async function addSearchEngine() {
  try {
    await validate()
    const { name, icon, description, url } = addEngineState
    const data: SearchEngineItem = {
      name,
      icon,
      description,
      id: name,
      baseUrl: url
    }

    commit(SearchMutations.addSearchEngine, data)
    addUseSearchEngines(name)

    // 重置并关闭表单
    resetFields()
    addEngineState.show = false
  } catch {}
}

function deleteSearchEngine(engineId: string) {
  commit(SearchMutations.deleteSearchEngine, engineId)
}
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

  .add-engine-layout {
    margin-top: 12px;

    .btn-list {
      text-align: center;
      margin-top: 32px;

      > button {
        margin-right: 8px;
      }
    }
  }
}
</style>
