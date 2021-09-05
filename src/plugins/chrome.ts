interface Permissions {
  permissions?: string[]
  origins?: string[]
}

export const isExtension = chrome && chrome.extension ? true : false

export function containsPermissions(permissions: Permissions): Promise<boolean> {
  return new Promise(resolve => {
    chrome.permissions.contains(permissions, resolve)
  })
}

export function requestPermissions(permissions: Permissions): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.permissions.request(permissions, resout => {
      if (resout) {
        resolve()
      } else {
        reject()
      }
    })
  })
}
