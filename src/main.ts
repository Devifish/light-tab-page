import { createApp } from "vue";
import App from "./App.vue";
import Store from "./store";
import "./plugins/moment";

const app = createApp(App);
app.use(Store);

app.mount("#app");
