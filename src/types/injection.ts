import type { InjectionKey, Ref } from "vue"
import { ThemeMode } from "./setting"

export const CURRENT_THEME_KEY: InjectionKey<Ref<ThemeMode>> = Symbol.for("CURRENT_THEME_KEY")
