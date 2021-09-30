import axios from "@/plugins/axios"
import { isEmpty } from "@/utils/common"

export interface AnalyzeUrlData {
  searchText?: string
  inputEncoding?: string
  page?: string | number
}

export class AnalyzeUrl {
  static readonly DEFAULT: AnalyzeUrlData = {
    inputEncoding: "utf-8"
  }

  url: URL

  constructor(url: string, data: AnalyzeUrlData) {
    const keys = Object.keys(data)
    for (let key of keys) {
      const express = `{${key}}`
      if (!url.includes(express)) continue

      url = url.replace(express, encodeURI(data[key]))
    }

    this.url = new URL(url)
  }

  static defalut<D extends AnalyzeUrlData>(url: string, data: D) {
    data = Object.assign(AnalyzeUrl.DEFAULT, data)
    return new AnalyzeUrl(url, data)
  }

  getUrl() {
    return this.url
  }

  getUrlString() {
    return this.url.toString()
  }
}

export class AnalyzeCss {
  readonly current: Document | Element

  private constructor(current: Document | Element) {
    this.current = current
  }

  static async load(url: string) {
    const { data } = await axios.get(url, {
      responseType: "document"
    })

    if (!(data instanceof Document)) throw new Error("error content")

    return new AnalyzeCss(data)
  }

  getElements(rule: string): AnalyzeCss[] {
    return Array.from(this.current.querySelectorAll(rule)).map(item => new AnalyzeCss(item))
  }

  getElement(rule: string) {
    const temp = this.current.querySelector(rule)
    return temp && new AnalyzeCss(temp)
  }

  getStringList(rule: string) {
    if (isEmpty(rule)) return null

    let type = "text"
    if (rule.includes("@")) {
      const temp = rule.split("@")

      rule = temp[0]
      type = temp[1]
    }

    const results = this.getElements(rule)
    const stringList: Array<string | null> = []
    if (isEmpty(results)) return stringList

    for (let item of results) {
      stringList.push(item.getData(type))
    }
    return stringList
  }

  getString(rule: string) {
    return this.getStringList(rule)?.join("\n")
  }

  getData(type: string) {
    switch (type) {
      case "href":
      case "src":
        return this.current instanceof Element ? this.current.getAttribute(type) : null
      case "text":
      default:
        return this.current?.textContent
    }
  }
}
