import { createApp } from "vue"
import Router from "./router"
import Store from "./store"
import App from "./App.vue"
import Extension from "./plugins/extension"
import "./style/index.less"

const app = createApp(App)
app.use(Router)
app.use(Store)
app.use(Extension)

app.mount(document.body)
