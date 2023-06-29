import type { Manifest } from "webextension-polyfill"
import fs from "fs/promises"
import { resolve } from "path"
import type { Plugin } from "vite"

const FILE_NAME = "manifest.json"
const BUILD_PATH = "dist"

export function defineManifest(manifest: Manifest.WebExtensionManifest) {
  return manifest
}

export async function buildManifest(manifest: Manifest.WebExtensionManifest) {
  const file = resolve(__dirname, "..", BUILD_PATH, FILE_NAME)

  await fs.writeFile(file, JSON.stringify(manifest, undefined, 2))
  console.info("build-manifest:", "write manifest.json")
}

export function viteBuildManifest(manifest: Manifest.WebExtensionManifest): Plugin {
  return {
    name: "vite-build-manifest",
    apply: "build",
    enforce: "pre",
    closeBundle() {
      buildManifest(manifest)
    }
  }
}
