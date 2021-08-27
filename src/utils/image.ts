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
