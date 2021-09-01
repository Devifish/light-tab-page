<template>
  <a-modal
    v-model:visible="state.visible"
    :title="title"
    :width="width"
    :footer="footer"
    :destroyOnClose="true"
    :okText="okText"
    :confirmLoading="state.confirmLoading"
    @ok="clickOkHandle"
  >
    <slot />
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRef, provide } from "vue"
import { CommonModalData, ModalData } from "@/utils/use"

export default defineComponent({
  name: "CommonModal",
  props: {
    title: String,
    footer: Object,
    width: {
      type: Number,
      default: 900
    },
    okText: String
  },
  setup() {
    const state = reactive({
      visible: false,
      confirmLoading: false,
      data: undefined,
      onOk: async () => {}
    })

    function open(data) {
      state.visible = true
      state.data = data
    }

    function close() {
      state.visible = false
    }

    function onOk(callback: () => Promise<void>) {
      state.onOk = callback
    }

    async function clickOkHandle() {
      if (typeof state.onOk === "function") {
        state.confirmLoading = true
        try {
          const value = await state.onOk()
        } finally {
          state.confirmLoading = false
        }
      }

      close()
    }

    provide<ModalData>(CommonModalData, {
      onOk,
      close,
      data: toRef(state, "data")
    })

    return {
      state,
      open,
      close,
      onOk,
      clickOkHandle
    }
  }
})
</script>
