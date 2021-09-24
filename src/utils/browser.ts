/**
 * 检测当前浏览器是否为Chrome
 * @returns
 */
export function isChrome(): boolean {
  const userAgent = navigator.userAgent.toLowerCase()

  return userAgent.includes("chrome")
}

/**
 * 判断是否为ObjectURL
 * @param url
 * @returns
 */
export function isObjectURL(url: string) {
  return url.startsWith("blob:")
}
