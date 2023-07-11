import { isEmpty } from "./common"

/**
 * 校验图片是否有效
 *
 * @param url URL
 * @returns boolean
 */
export async function verifyImageUrl(url: string) {
  if (isEmpty(url)) return false

  let tempImg = new Image()
  tempImg.src = url

  try {
    await new Promise((resolve, reject) => {
      tempImg.onload = resolve
      tempImg.onerror = reject
    })
    return true
  } catch {
    return false
  } finally {
    tempImg.remove()
  }
}

/**
 * 校验是否为图片文件
 *
 * @param file 文件Blob
 * @returns boolean
 */
export function isImageFile(file: Blob) {
  const imageType = ["png", "jpeg", "jpg", "gif"]

  let fileType = file.type
  fileType = fileType.substring(fileType.lastIndexOf("/") + 1, fileType.length)

  return imageType.includes(fileType)
}

/**
 * 获取图片像素点
 *
 * @param url URL
 * @returns ImageData
 */
export function getPixels(url: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")!

    const image = new Image()
    image.src = url
    image.onload = () => {
      context.drawImage(image, 0, 0)

      //获取像素矩阵
      const data = context.getImageData(0, 0, image.width, image.height)
      resolve(data)

      canvas.remove()
    }

    image.onerror = reject
  })
}
