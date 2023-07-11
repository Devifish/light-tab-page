import { getPixels } from "./img"

interface RGBColor {
  r: number
  g: number
  b: number
}

interface ColorCount {
  color: string
  count: number
}

/**
 * 颜色八叉树节点
 * 这里的 next 不是指兄弟链中的 next 指针
 * 而是在 reducible 链表中的下一个节点
 */
class ColorOctreeNode {
  isLeaf: boolean
  children: Array<ColorOctreeNode | undefined>
  next?: ColorOctreeNode

  color: RGBColor
  count: number

  constructor() {
    this.isLeaf = false
    this.children = new Array(8)

    this.color = { r: 0, g: 0, b: 0 }
    this.count = 0
  }
}

/**
 * 颜色八叉树
 */
class ColorOctree {
  root: ColorOctreeNode
  reducible: Array<ColorOctreeNode>
  leafNum: number

  constructor() {
    this.root = new ColorOctreeNode()
    this.reducible = new Array(7)
    this.leafNum = 0
  }

  /**
   * createNode
   *
   * @param level node level
   * @return the new node
   */
  private createNode(level: number): ColorOctreeNode {
    var node = new ColorOctreeNode()
    if (level === 7) {
      node.isLeaf = true
      this.leafNum++
    } else {
      node.next = this.reducible[level]
      this.reducible[level] = node
    }

    return node
  }

  /**
   * addColor
   *
   * @param node the octree node
   * @param color color object
   * @param level node level
   */
  private addColor(node: ColorOctreeNode, color: RGBColor, level: number) {
    const { r, g, b } = color

    if (node.isLeaf) {
      node.count++
      node.color.r += r
      node.color.g += g
      node.color.b += b
    } else {
      const offset = 7 - level
      const b_r = (r >> offset) & 1,
        b_g = (g >> offset) & 1,
        b_b = (b >> offset) & 1

      const idx = (b_r << 2) + (b_g << 1) + b_b
      let children = node.children[idx]
      if (!children) {
        children = this.createNode(level + 1)
        node.children[idx] = children
      }

      this.addColor(children, color, level + 1)
    }
  }

  /**
   * reduceTree
   */
  private reduceTree() {
    // find the deepest level of node
    let lv = 6
    let node: ColorOctreeNode
    while (!(node = this.reducible[lv])) lv--

    // get the node and remove it from reducible link
    this.reducible[lv] = node.next!

    // merge children
    let count = 0
    let r = 0,
      g = 0,
      b = 0

    for (let i = 0; i < 8; i++) {
      const children = node.children[i]
      if (!children) continue

      r += children.color.r
      g += children.color.g
      b += children.color.b
      count += children.count
      this.leafNum--
    }

    node.isLeaf = true
    node.color = { r, g, b }
    node.count = count
    this.leafNum++
  }

  /**
   * buildOctree
   *
   * @param pixels The pixels array
   * @param maxColors The max count for colors
   */
  buildTree(pixels: Uint8ClampedArray, maxColors: number) {
    for (var i = 0; i < pixels.length; i += 4) {
      const r = pixels[i],
        g = pixels[i + 1],
        b = pixels[i + 2]

      // 添加颜色
      this.addColor(this.root, { r, g, b }, 0)

      // 合并叶子节点
      while (this.leafNum > maxColors) {
        this.reduceTree()
      }
    }
    console.log("buildTree Complete")
  }

  /**
   * statistics
   *
   * @param node the node will be stats
   * @param object color stats
   */
  statistics(node: ColorOctreeNode, obj: Record<string, number>) {
    if (node.isLeaf) {
      const r = Math.floor(node.color.r / node.count),
        g = Math.floor(node.color.g / node.count),
        b = Math.floor(node.color.b / node.count)

      const color = ((r << 16) + (g << 8) + b).toString(16)
      if (obj[color]) {
        obj[color] += node.count
      } else {
        obj[color] = node.count
      }

      return
    }

    for (var i = 0; i < 8; i++) {
      const children = node.children[i]
      if (children) {
        this.statistics(children, obj)
      }
    }
  }
}

function createColorArray(pixels: Uint8ClampedArray): RGBColor[] {
  const pixelCount = pixels.length
  const pixelArray = new Array<RGBColor>()
  for (let i = 0; i < pixelCount; i += 4) {
    const offset = i * 4
    const r = pixels[offset + 0],
      g = pixels[offset + 1],
      b = pixels[offset + 2],
      a = pixels[offset + 3]

    // If pixel is mostly opaque and not white
    if (typeof a === "undefined" || a >= 125) {
      if (!(r > 250 && g > 250 && b > 250)) {
        pixelArray.push({ r, g, b })
      }
    }
  }
  return pixelArray
}

export async function fromUrl(url: string) {
  const octree = new ColorOctree()
  const { data } = await getPixels(url)
  octree.buildTree(data, 32)

  var colors: Record<string, number> = {}
  octree.statistics(octree.root, colors)

  var result: Array<ColorCount> = []
  for (var key in colors) {
    result.push({ color: key, count: colors[key] })
  }

  result.sort((i1, i2) => i2.count - i1.count)
  return result.slice(0, 10).map(i => `#${i.color}`)
}
