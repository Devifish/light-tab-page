<template>
  <div class="home-top-site-layout">
    <ul class="home-top-site-grid">
      <li
        v-for="item of topSites"
        :key="item.url"
        class="home-top-site-item"
        @click="openPage(item.url)"
      >
        <icon
          class="home-top-site-icon"
          :text-icon="item.textIcon"
          :src="item.icon"
          :title="item.title"
        />

        <div class="icon-title">
          <span>{{ item.title }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "@/store"
import { OpenPageTarget } from "@/types"
import { computed } from "vue"

// Vuex
const store = useStore()
const topSites = computed(() => store.state.topSite.topSites)

const row = computed(() => Math.ceil(topSites.value.length / 3))

function openPage(url: string) {
  window.open(url, OpenPageTarget.Blank)
}
</script>

<style lang="less">
.home-top-site-layout {
  padding: 8px;

  .home-top-site-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(v-bind(row), 92px);
    gap: 8px;
  }

  .home-top-site-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 8px;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .home-top-site-icon {
      height: 32px;
      width: 32px;
    }

    .icon-title {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 72px;
      font-size: 12px;
      text-align: center;
      user-select: none;
    }
  }
}
</style>
