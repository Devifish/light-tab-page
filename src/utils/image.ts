import { isEmpty } from "./common";

export async function verifyImageUrl(url: string) {
  if (isEmpty(url)) return false;

  let tempImg = new Image();
  tempImg.src = url;

  try {
    await new Promise((resolve, reject) => {
      tempImg.onload = resolve;
      tempImg.onerror = reject;
    });
    return true;
  } catch {
    return false;
  } finally {
    tempImg.remove();
  }
}

export async function isImageFile(file: Blob) {
  const imageType = ["png", "jpeg", "jpg", "gif"];

  let fileType = file.type;
  fileType = fileType.substring(fileType.lastIndexOf("/") + 1, fileType.length);

  return imageType.includes(fileType);
}
