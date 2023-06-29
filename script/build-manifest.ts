import fs from "fs/promises"
import { resolve } from "path"
import type { Plugin } from "vite"

const FILE_NAME = "manifest.json"
const BUILD_PATH = "dist"

type Manifest = chrome.runtime.Manifest
type ManifestV2 = chrome.runtime.ManifestV2
type ManifestV3 = chrome.runtime.ManifestV3

export function defineManifestV2(manifest: ManifestV2): Manifest {
  return manifest
}

export function defineManifestV3(manifest: ManifestV3): Manifest {
  return manifest
}

export async function buildManifest(manifest: Manifest) {
  const file = resolve(__dirname, "..", BUILD_PATH, FILE_NAME)

  await fs.writeFile(file, JSON.stringify(manifest, undefined, 2))
  console.info("build-manifest:", "write manifest.json")
}

export function viteBuildManifest(manifest: Manifest): Plugin {
  return {
    name: "vite-build-manifest",
    apply: "build",
    enforce: "pre",
    closeBundle() {
      buildManifest(manifest)
    }
  }
}
