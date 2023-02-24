import { createRouter, createWebHashHistory } from "vue-router"
import Home from "@/views/home/Index.vue"
import Popup from "@/views/popup/Index.vue"

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/popup",
      name: "Popup",
      component: Popup
    }
  ]
})
