import { createRouter, createWebHashHistory } from "vue-router"
import Home from "@/views/home/Index.vue"
import Popup from "@/views/popup/Index.vue"
import SearchResult from "@/views/home/SearchResult.vue"

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      children: [
        {
          path: "/search/:engine/:text",
          name: "SearchResult",
          component: SearchResult
        }
      ]
    },
    {
      path: "/popup",
      name: "Popup",
      component: Popup
    }
  ]
})
