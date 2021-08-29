import { Ref, inject } from "vue";

export const CommonDrawerData = Symbol();
export const CommonModalData = Symbol();

export interface DialogData {
  onOk: (callback: () => Promise<void>) => void;
  close: () => void;
  data: Ref<any>;
}

export interface DrawerData extends DialogData {}
export interface ModalData extends DialogData {}

export function useDrawer(): DialogData {
  const drawer = inject<DrawerData>(CommonDrawerData);
  if (!drawer) {
    throw new Error("请在CommonDrawer的组件内使用");
  }

  return drawer;
}

export function useModal(): ModalData {
  const modal = inject<ModalData>(CommonModalData);
  if (!modal) {
    throw new Error("请在CommonModal的组件内使用");
  }

  return modal;
}
