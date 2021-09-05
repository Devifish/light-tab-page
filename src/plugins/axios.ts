import Axios from "axios"
import { isExtension, containsPermissions, requestPermissions } from "@/utils/chrome"

const axios = Axios.create({
  timeout: 10000
})

axios.interceptors.request.use(async data => {
  if (isExtension) {
    const { baseURL, url } = data
    const origins = [(baseURL ?? "") + url]

    // 请求权限
    if (!(await containsPermissions({ origins }))) {
      await requestPermissions({ origins })
    }
  }

  return data
})

export default axios
