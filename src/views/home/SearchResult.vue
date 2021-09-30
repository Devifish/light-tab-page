<template>
  <div class="search-main">
    <a-list class="search-list" :split="false" :loading="state.loading">
      <template v-for="item in state.searchList">
        <a-list-item v-if="item.title" :key="item.url">
          <a-card style="width: 100%">
            <a-card-meta :description="item.urlText">
              <template #title>
                <a class="link-title" :href="item.url" :target="state.openPageTarget">
                  {{ item.title }}
                </a>
              </template>
              <template #avatar v-if="!isEmpty(item.icon)">
                <a-avatar :src="item.icon" />
              </template>
            </a-card-meta>

            <a-divider style="margin: 16px 0" />
            <div class="item-content">
              <img v-if="item.cover" class="content-cover" :src="item.cover" />
              {{ item.description }}
            </div>
          </a-card>
        </a-list-item>
      </template>

      <template #loadMore>
        <!-- <div
          :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
        >
          <a-button type="text"> 加载更多 </a-button>
        </div> -->
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "@/store"
import { SearchResultData } from "@/types"
import { isEmpty } from "@/utils/common"
import { computed, onMounted, reactive } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const { state: stateX } = useStore()
const { text } = route.params

const state = reactive({
  loading: false,
  searchList: [] as SearchResultData,
  currentRule: computed(() => stateX.search.rules[stateX.setting.search.currentEngine]),
  openPageTarget: computed(() => stateX.setting.search.openPageTarget)
})

async function loadSearchList() {
  state.loading = true
  const searchList = await state.currentRule.getSearchList(text as string, 0)

  console.log("searchList:", searchList)
  state.searchList = searchList
  state.loading = false
}

onMounted(loadSearchList)
</script>

<style lang="less">
.search-main {
  position: fixed;
  height: 100%;
  width: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;

  .search-list {
    width: 750px;
    min-height: 300px;
    padding-top: 96px;
    padding-bottom: 32px;

    .link-title {
      font-size: 20px;
    }

    .item-content {
      img {
        width: 128px;
        float: left;
        margin-right: 8px;
      }
    }
  }
}
</style>
