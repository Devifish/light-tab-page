// fix webextension-polyfill browser load
if (!chrome || !chrome.runtime || !chrome.runtime.id) {
  chrome = { runtime: { id: "browser" } }
}
