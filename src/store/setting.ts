import { createStore, Store } from "vuex";
import { BackgroundSetting, BackgroundType, ThemeMode, ViewSetting } from "@/types";
import { copy, isEmpty, uuid } from "@/utils/common";
import { wallpaperStore } from "@/plugins/localforage";
import { isImageFile } from "@/utils/image";
import { InjectionKey } from "vue";
import { getDailyWallpaperUrl } from "@/api/bing";

interface SettingState {
  view: ViewSetting;
  layout?: object;
}

const SETTING_STORAGE = "setting-data";

export const SETTING_STORE_KEY: InjectionKey<Store<SettingState>> = Symbol();
export default createStore<SettingState>({
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
          autoOpacity: true,
        },
      },
    };

    const settingData = JSON.parse(localStorage[SETTING_STORAGE] ?? "{}");
    copy(settingData, defaultState, true);

    return defaultState;
  },
  getters: {},
  mutations: {
    updateViewSetting(state, view: ViewSetting) {
      copy(view, state.view);
      saveSettingState(state);
    },
    updateBackgroundSetting(state, background: BackgroundSetting) {
      copy(background, state.view.background!);
      saveSettingState(state);
    },
    updateLayoutSetting(state) {
      saveSettingState(state);
    },
  },

  actions: {
    async uploadBackgroundImage({ commit }, imageFile: File) {
      if (!isImageFile(imageFile)) throw new Error("这不是一个图片文件");

      const id = uuid();
      const url = URL.createObjectURL(imageFile);

      // 清除上次壁纸
      await wallpaperStore.clear();

      // 保存图片到IndexedDB
      await wallpaperStore.setItem<Blob>(id, imageFile);
      commit("updateBackgroundSetting", {
        id,
        url,
      });
    },

    async reloadBackgroundImage({ state, commit }) {
      const id = state.view.background?.id!;
      const file = await wallpaperStore.getItem<Blob>(id);

      // 校验图片数据是否可用，否则删除该数据
      if (file && isImageFile(file)) {
        const url = URL.createObjectURL(file);
        commit("updateBackgroundSetting", { url });
      } else {
        commit("updateBackgroundSetting", { id: null, url: null });
        await wallpaperStore.removeItem(id);
      }
    },

    async loadBingDailyWallpaper({ commit }) {
      const url = await getDailyWallpaperUrl();

      if (isEmpty(url)) return;
      commit("updateBackgroundSetting", { url });
    },
  },
});

function saveSettingState(data: SettingState) {
  const settingJson = JSON.stringify(data);
  localStorage.setItem(SETTING_STORAGE, settingJson);
}
