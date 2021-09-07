/**
 * 校验各种类型数据是否为空
 *
 * @param obj 对象
 */
export function isEmpty(obj: any): boolean {
  if (typeof obj === "string") {
    return obj.length === 0
  } else if (obj instanceof Array) {
    return obj.length === 0
  } else if (obj instanceof Set) {
    return obj.size === 0
  } else if (obj === null) {
    return true
  } else if (obj === undefined) {
    return true
  } else {
    return false
  }
}

/**
 * 深克隆
 *
 * @param obj 对象
 */
export function deepClone<E extends object>(obj: E, ...ignoreKeys: string[]): E {
  const json = JSON.stringify(obj)
  const newObj = JSON.parse(json)

  for (let key of ignoreKeys) {
    if (newObj.hasOwnProperty(key)) {
      delete newObj[key]
    }
  }
  return newObj
}

/**
 * 复制参数
 *
 * @param source 来源
 * @param target 目标
 */
export function copy(
  source: Object,
  target: Object,
  onlyExist: boolean = false,
  skipEmpty: boolean = true
) {
  const keys = Object.keys(source)
  for (const key of keys) {
    const temp = source[key]

    if (skipEmpty && isEmpty(temp)) continue
    if (onlyExist && !target.hasOwnProperty(key)) continue

    // 复制对应参数
    target[key] = temp
  }
}

/**
 * 生成UUID
 *
 * @returns string uuid
 */
export function uuid() {
  var temp: any[] = []
  var hexDigits = "0123456789abcdef"

  for (var i = 0; i < 36; i++) {
    temp[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }

  temp[14] = "4" // bits 12-15 of the time_hi_and_version field to 0010
  temp[19] = hexDigits.substr((temp[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  temp[8] = temp[13] = temp[18] = temp[23] = "-"
  return temp.join("")
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
