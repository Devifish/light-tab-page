<template>
  <div class="top-site-warp">
    <transition-group class="top-site-grid" name="flip-list" tag="ul">
      <li
        class="top-site-icon-item"
        :class="{
          hide: dragState.current === index
        }"
        v-for="(item, index) of topSites"
        :key="item.url"
      >
        <div
          class="top-site-icon"
          :class="{ 'shake-active': dragState.shake }"
          draggable="true"
          @click="openPage(item.url)"
          @dragstart="onDragIcon(DragType.start, index)"
          @dragenter="onDragIcon(DragType.enter, index, $event)"
          @dragover="onDragIcon(DragType.over, index, $event)"
          @dragend="onDragIcon(DragType.end, index)"
        >
          <span v-if="item.textIcon" class="icon-content text-icon">
            {{ getFontIcon(item.title) }}
          </span>
          <img v-else class="icon-content" :src="item.icon" alt="logo" draggable="false" />

          <div class="icon-board"></div>
        </div>

        <div class="icon-title">
          <span>{{ item.title }}</span>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, reactive, ref } from "vue"
import { useStore } from "vuex"
import { SETTING_STORE_KEY } from "@/store/setting"
import { TOP_SITE_STORE_KEY } from "@/store/top-site"
import { DragType, OpenPageTarget, SortData, TopSites } from "@/types"

const settingStore = useStore(SETTING_STORE_KEY)
const topSiteStore = useStore(TOP_SITE_STORE_KEY)

const topSiteSetting = computed(() => settingStore.state.topSite)
const topSites = computed<TopSites>(() => topSiteStore.getters.getCurrentTopSites)

const dragState = reactive({
  current: -1,
  shake: false
})

function openPage(url: string) {
  window.open(url, OpenPageTarget.Blank)
}

function getFontIcon(text: string) {
  const firstChar = text.trim().charAt(0)
  return firstChar.toUpperCase()
}

function onDragIcon(type: DragType, index: number, e?: Event) {
  switch (type) {
    case DragType.start:
      dragState.current = index
      dragState.shake = true
      return
    case DragType.enter:
      if (dragState.current === index) return
      const sortData: SortData = {
        from: dragState.current,
        to: index
      }

      topSiteStore.commit("sortTopSites", sortData)
      dragState.current = index
      return
    case DragType.over:
      e?.preventDefault()
      return
    case DragType.end:
      dragState.shake = false
      dragState.current = -1
      return
  }
}

async function init() {
  if (!topSiteStore.state.init) {
    await topSiteStore.dispatch("initTopSites")
  }
}

onBeforeMount(init)
</script>

<style lang="less">
@item-size-max: 128px;
@col: v-bind("topSiteSetting.col");
@row: v-bind("topSiteSetting.row");
@gap: v-bind("`${topSiteSetting.gap}px`");
@icon-size: v-bind("`${topSiteSetting.iconSize}px`");
@board-size: v-bind("`${topSiteSetting.boardSize}px`");
@board-color: v-bind("topSiteSetting.boardColor");
@board-opacity: v-bind("topSiteSetting.boardOpacity");
@board-radius: v-bind("`${topSiteSetting.boardRadius}px`");

.top-site-warp {
  .top-site-grid {
    height: calc(@row * (@item-size-max + @gap));
    width: calc(@col * (@item-size-max + @gap));
    padding: 0;
    list-style: none;

    display: grid;
    grid-template-columns: repeat(@col, calc(100% / @col));
    grid-template-rows: repeat(@row, calc(100% / @row));
  }

  .top-site-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 8px;

    &.hide {
      opacity: 0;
    }

    .top-site-icon {
      width: @board-size;
      height: @board-size;
      position: relative;
      cursor: pointer;

      &.shake-active {
        animation: shake 0.3s infinite;
      }

      .icon-content {
        width: @icon-size;
        height: @icon-size;
        position: absolute;
        inset: 0;
        margin: auto;
        z-index: 1;

        &.text-icon {
          text-align: center;
          font-size: 32px;
          line-height: @icon-size;
          user-select: none;
        }
      }

      .icon-board {
        height: 100%;
        background-color: @board-color;
        opacity: @board-opacity;
        border-radius: @board-radius;
      }
    }

    .icon-title {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: @item-size-max;
      text-align: center;
      user-select: none;
    }
  }
}

[data-theme="dark"] {
  .top-site-warp {
    .top-site-icon-item {
      &:hover {
        background-color: rgba(0, 0, 0, 0.2);
      }

      .icon-board {
        background-color: #1f1f1f !important;
        transition: background-color 0.3s ease;
      }
    }
  }
}
</style>
