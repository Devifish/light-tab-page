import { Module } from "vuex";
import { BackgroundType, ThemeMode, ViewSetting } from "@/types";
import { copy } from "@/utils/common";

interface SettingState {
  view: ViewSetting;
  layout?: object;
}

const SETTING_STORAGE = "setting-data";

function initSettingState() {
  const defaultSettingState: SettingState = {
    view: {
      themeMode: ThemeMode.Auto,
      backgroundType: BackgroundType.None,
    },
  };

  // 读取配置
  const settingData = JSON.parse(localStorage[SETTING_STORAGE] ?? "{}");
  copy(settingData, defaultSettingState, true);

  return defaultSettingState;
}

function saveSettingState(data: SettingState) {
  const settingJson = JSON.stringify(data);
  localStorage.setItem(SETTING_STORAGE, settingJson);
}

const settingModule: Module<SettingState, any> = {
  namespaced: true,
  state: initSettingState,
  getters: {
    getViewSetting(state) {
      return state.view;
    }
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

export default settingModule;
