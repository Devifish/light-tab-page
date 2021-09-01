import { createApp } from "vue"
import Store from "./store"
import App from "./App.vue"
import "./plugins/moment"

const app = createApp(App)
app.use(Store)

app.mount("#app")
