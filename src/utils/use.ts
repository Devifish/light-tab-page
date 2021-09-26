import { onUnmounted, ref } from "vue"

/**
 * Reactive Media Query.
 *
 * @see https://vueuse.org/useMediaQuery
 * @param query
 * @param options
 */
export function useMediaQuery(query: string) {
  if (!window) return ref(false)

  const mediaQuery = window.matchMedia(query)
  const matches = ref(mediaQuery.matches)

  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches
  }

  mediaQuery.addEventListener("change", handler)

  onUnmounted(() => {
    mediaQuery.removeEventListener("change", handler)
  })
  return matches
}

export function usePreferredDark() {
  return useMediaQuery("(prefers-color-scheme: dark)")
}
