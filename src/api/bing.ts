import axios from "@/plugins/axios"
import { isEmpty } from "@/utils/common"

const BASE_URL = "https://cn.bing.com"

export async function getDailyWallpaperUrl(n: number = 1) {
  const { data } = await axios.get("/HPImageArchive.aspx", {
    baseURL: BASE_URL,
    params: {
      format: "js",
      idx: 0,
      n,
      mkt: "zh-CN"
    }
  })

  const imageData = data.images && data.images[0]
  return isEmpty(imageData) ? null : BASE_URL + imageData.url
}
