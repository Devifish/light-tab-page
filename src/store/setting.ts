import { Module } from "vuex";

export enum ThemeType {
  auto, light, dart
}

interface SettingState {
  theme: ThemeType
}



const settingModule: Module<SettingState, any> = {
  namespaced: true,
  state: {
    theme: ThemeType.auto
  },
  getters: {
    getTheme(state) {
      return state.theme;
    }
  },
  mutations: {},
  actions: {},
};

export default settingModule;
