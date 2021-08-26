import { Module } from "vuex";
import { BackgroundType, ThemeMode, ViewSetting } from "@/types";
import { copy } from "@/utils/common";

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
        backgroundType: BackgroundType.None,
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
  },
  mutations: {
    updateViewSetting(state, view: ViewSetting) {
      copy(view, state.view, true);
      saveSettingState(state);
    },
    updateLayoutSetting(state) {
      saveSettingState(state);
    },
  },
};

function saveSettingState(data: SettingState) {
  const settingJson = JSON.stringify(data);
  localStorage.setItem(SETTING_STORAGE, settingJson);
}

export default settingModule;
