import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/zh-cn"
import "dayjs/locale/zh-tw"
import "dayjs/locale/en"

dayjs.extend(relativeTime)
dayjs.locale("zh-cn")

export default dayjs
