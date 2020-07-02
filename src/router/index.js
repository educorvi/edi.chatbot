import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { i18n } from "@/main";
import trans from "../lang"


Vue.use(VueRouter)

  const routes = [
    {
      path: "/:lang",
      component: Home,
      beforeEnter(to, from, next) {
        const lang = to.params.lang;
        if (!Object.keys(trans).includes(lang)) return next("de");
        if (i18n.locale !== lang) {
          i18n.locale = lang;
        }
        return next();
      },
      children: [
        {
          path: "home",
          name: "home",
          component: Home
        },
        // {
        //   path: "about",
        //   name: "about",
        //   // route level code-splitting
        //   // this generates a separate chunk (about.[hash].js) for this route
        //   // which is lazy-loaded when the route is visited.
        //   component: () =>
        //       import(/* webpackChunkName: "about" */ "./views/About.vue")
        // }
      ]
    },
    {
      path: "*",
      redirect: "/de"
    }
]

const router = new VueRouter({
  routes
})

export default router
