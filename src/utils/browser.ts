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

/**
 * 文件转Base64
 *
 * @param file 文件
 * @returns Base64
 */
export async function fileToBase64(file: File) {
  const reader = new FileReader()
  reader.readAsDataURL(file)

  await new Promise(resolve => (reader.onload = resolve))
  return reader.result
}

/**
 * Base64转Blob
 *
 * @param base64 base64
 * @returns Blob
 */
export function base64ToBlob(base64: string) {
  const temp = base64.split(","),
    mime = temp[0].match(/:(.*?);/)![1],
    data = atob(temp[1]),
    u8arr = new Uint8Array(data.length)

  let index = data.length
  while (index--) {
    u8arr[index] = data.charCodeAt(index)
  }

  return new Blob([u8arr], { type: mime })
}
