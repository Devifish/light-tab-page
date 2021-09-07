import { createApp } from "vue"
import Store from "./store"
import App from "./App.vue"
import Extension from "./plugins/extension"
import "./plugins/moment"

const app = createApp(App)
app.use(Store)
app.use(Extension)

app.mount(document.body)
