import axios from "@/plugins/axios"

export async function getBaiduSuggestion(keyword: string): Promise<string[]> {
  const { data } = await axios.get("https://suggestion.baidu.com/su", {
    params: {
      p: 3,
      ie: "UTF-8",
      cb: "",
      wd: keyword
    },
    responseType: "text"
  })

  const find_date = /.*?s:(\[.*?\]).*?/
  const jsonText = find_date.exec(data)![1] ?? "[]"
  return JSON.parse(jsonText)
}
