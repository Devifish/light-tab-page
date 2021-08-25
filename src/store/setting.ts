import { Module } from "vuex";

export enum ThemeMode {
  auto,
  light,
  dart,
}

interface SettingState {
  themeMode: ThemeMode;
}

const themeMode = Number.parseInt(localStorage["themeMode"] ?? `${ThemeMode.auto}`);

const settingModule: Module<SettingState, any> = {
  namespaced: true,
  state: {
    themeMode: themeMode,
  },
  getters: {
    getThemeMode(state) {
      return state.themeMode;
    },
  },
  mutations: {
    updateThemeMode(state, themeMode: ThemeMode) {
      state.themeMode = themeMode;
      localStorage.setItem("themeMode", themeMode.toString());
    },
  },
  actions: {},
};

export default settingModule;
