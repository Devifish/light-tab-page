import axios from "@/plugins/axios"

export async function getBaiduSuggestion(keyword: string): Promise<string[]> {
  try {
    const { data } = await axios.get("https://suggestion.baidu.com/su", {
      params: {
        p: 3,
        ie: "UTF-8",
        cb: "",
        wd: keyword
      },
      responseType: "text"
    })

    const find = /.*?s:(\[.*?\]).*?/
    const jsonText = find.exec(data)![1] ?? "[]"
    return JSON.parse(jsonText)
  } catch {
    return []
  }
}

export async function getBingSuggestion(keyword: string): Promise<string[]> {
  try {
    const { data } = await axios.get("https://api.bing.com/qsonhs.aspx", {
      params: {
        type: "json",
        q: keyword
      }
    })

    return data["AS"]["Results"][0]["Suggests"].map(item => item["Txt"])
  } catch {
    return []
  }
}
