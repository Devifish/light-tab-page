import { Module } from "vuex";
import { BackgroundSetting, BackgroundType, ThemeMode, ViewSetting } from "@/types";
import { base64ToBlob, copy, fileToBase64, uuid } from "@/utils/common";
import { wallpaperStore } from "@/plugins/localforage";
import axios from "axios";

interface SettingState {
  view: ViewSetting;
  layout?: object;
}

const SETTING_STORAGE = "setting-data";

const settingModule: Module<SettingState, any> = {
  namespaced: true,
  state() {
    const defaultState: SettingState = {
      view: {
        themeMode: ThemeMode.Auto,
        background: {
          id: "",
          type: BackgroundType.None,
          url: "",
          blur: 0,
          maskColor: "#000",
          maskOpacity: 0,
        },
      },
    };

    const settingData = JSON.parse(localStorage[SETTING_STORAGE] ?? "{}");
    copy(settingData, defaultState, true);

    return defaultState;
  },
  getters: {
    getViewSetting(state) {
      return state.view;
    },
    getBackgroundSetting(state) {
      return state.view.background;
    },
  },
  mutations: {
    updateViewSetting(state, view: ViewSetting) {
      copy(view, state.view, true);
      saveSettingState(state);
    },
    updateBackgroundSetting(state, background: BackgroundSetting) {
      copy(background, state.view.background, true);
      saveSettingState(state);
    },
    updateLayoutSetting(state) {
      saveSettingState(state);
    },
  },

  actions: {
    async uploadBackgroundImage({ commit }, imageFile: File) {
      const url = URL.createObjectURL(imageFile),
        base64 = await fileToBase64(imageFile),
        id = uuid();

      // 清除上次壁纸
      await wallpaperStore.clear();

      // 保存图片到IndexedDB
      await wallpaperStore.setItem(id, base64);
      commit("updateBackgroundSetting", {
        id,
        url,
      });
    },

    async reloadBackgroundImage({ state, commit }) {
      const id = state.view.background?.id!,
        base64 = await wallpaperStore.getItem(id),
        url = URL.createObjectURL(base64ToBlob(base64 as string));

      commit("updateBackgroundSetting", { url });
    },
  },
};

function saveSettingState(data: SettingState) {
  const settingJson = JSON.stringify(data);
  localStorage.setItem(SETTING_STORAGE, settingJson);
}

export default settingModule;
