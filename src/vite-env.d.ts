/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly npm_package_name: string
  readonly npm_package_version: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
