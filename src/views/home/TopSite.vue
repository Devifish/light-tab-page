<template>
  <div class="top-site-warp">
    <transition-group class="top-site-grid" name="flip-list" tag="ul">
      <li
        v-for="(item, index) of topSites"
        :key="item.url"
        class="top-site-item"
        :class="{
          hide: state.currentDrag === index
        }"
      >
        <icon
          :class="['top-site-icon', { 'shake-active': state.shake }]"
          :text-icon="item.textIcon"
          :src="item.icon"
          :title="item.title"
          :size="topSiteSetting.iconSize"
          draggable="true"
          @click="openPage(item.url)"
          @contextmenu.prevent.stop="openEditStatus"
          @dragstart="onDragIcon(DragType.start, index)"
          @dragenter="onDragIcon(DragType.enter, index)"
          @dragover.prevent
          @dragend="onDragIcon(DragType.end, index)"
        >
          <div class="icon-board"></div>

          <transition name="scale">
            <sup
              v-show="state.editStatus"
              class="bubble-delete"
              @click.stop="deleteTopSite(index)"
            ></sup>
          </transition>
        </icon>

        <div class="icon-title">
          <span>{{ item.title }}</span>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, reactive } from "vue"
import { DragType, OpenPageTarget, SortData, TopSites } from "@/types"
import { useStore } from "@/store"
import { TopSiteActions, TopSiteGetters, TopSiteMutations } from "@/store/top-site"
import Icon from "@/components/Icon.vue"

const store = useStore()

const topSiteSetting = computed(() => store.state.setting.topSite)
const topSites = computed<TopSites>(() => store.getters[TopSiteGetters.getCurrentTopSites])

const state = reactive({
  currentDrag: -1,
  shake: false,
  editStatus: false
})

function openPage(url: string) {
  window.open(url, OpenPageTarget.Blank)
}

function deleteTopSite(index: number) {
  store.commit(TopSiteMutations.deleteTopSite, index)
}

function openEditStatus() {
  state.shake = true
  state.editStatus = true

  // 点击其他位置关闭编辑状态
  document.body.addEventListener("click", closeEditStatus)
}

function closeEditStatus(e: Event) {
  if (state.editStatus) {
    e.stopPropagation()

    state.shake = false
    state.editStatus = false
    document.body.removeEventListener("click", closeEditStatus)
  }
}

function onDragIcon(type: DragType, index: number) {
  switch (type) {
    case DragType.start:
      state.currentDrag = index
      openEditStatus()
      return
    case DragType.enter:
      if (state.currentDrag === index) return
      const sortData: SortData = {
        from: state.currentDrag,
        to: index
      }

      store.commit(TopSiteMutations.sortTopSites, sortData)
      state.currentDrag = index
      return
    case DragType.end:
      state.currentDrag = -1
      return
  }
}

async function init() {
  if (!store.state.topSite.init) {
    await store.dispatch(TopSiteActions.syncBrowserTopSites)
  }
}

onBeforeMount(init)
</script>

<style lang="less">
@item-size-max: 128px;
@col: v-bind("topSiteSetting.col");
@row: v-bind("topSiteSetting.row");
@gap: v-bind("`${topSiteSetting.gap}px`");
@board-size: v-bind("`${topSiteSetting.boardSize}px`");
@board-color: v-bind("topSiteSetting.boardColor");
@board-opacity: v-bind("topSiteSetting.boardOpacity");
@board-radius: v-bind("`${topSiteSetting.boardRadius}px`");

.top-site-warp {
  height: calc(@row * @item-size-max + (@row - 1) * @gap);
  width: calc(@col * @item-size-max + (@col - 1) * @gap);

  .top-site-grid {
    display: grid;
    grid-template-columns: repeat(@col, @item-size-max);
    grid-template-rows: repeat(@row, @item-size-max);
    gap: @gap;
  }

  .top-site-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    row-gap: 8px;

    &.hide {
      opacity: 0;
    }

    &.flip-list-enter-from,
    &.flip-list-leave-to {
      transform: translateY(@board-size);
    }

    .top-site-icon {
      width: @board-size;
      height: @board-size;
      cursor: pointer;

      &.shake-active {
        animation: shake 0.3s infinite;
      }

      .icon-board {
        height: 100%;
        background-color: @board-color;
        opacity: @board-opacity;
        border-radius: @board-radius;
      }

      .bubble-delete {
        width: 18px;
        height: 18px;

        position: absolute;
        top: -9px;
        right: -9px;
        color: #f5f5f5;
        background-color: #f5222d;
        text-align: center;
        line-height: 18px;
        font-size: 12px;
        border-radius: 50%;

        &::before {
          content: "X";
        }
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
    .top-site-item {
      .icon-board {
        background-color: #1f1f1f !important;
        transition: background-color 0.3s ease;
      }
    }
  }
}
</style>
