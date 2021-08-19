import Vue from "vue";
import Router from "vue-router";
import { DefaultLayout } from "@/components/Layout"
import Home from "@/views/Home";
import About from "@/views/About";
import Screen from "@/views/Screen";
import IoPage from "@/views/Io";
import PublicPage from "@/views/PublicPage";
Vue.use(Router);

const routes = [{
    path: "/",
    component: DefaultLayout,
    children: [{
      path: "/:id?",
      name: "home",
      component: Home
    }, {
      path: "/about",
      name: "about",
      component: About
    }]
  },
  {
    path: "/project/:projectId/screen/:screenId",
    name: "Screen",
    component: Screen

  },
  {
    path: "/stream/:projectId/screen/:screenId",
    name: "stream",
    component: Screen

  },
  {
    path: "/io/io",
    name: 'io',
    component: IoPage
  },
  {
    path: "/public/page",
    name: "public",
    component: PublicPage
  }
];

const router = new Router({
  mode: 'hash',
  base: '/secure/spaces.do',
  linkActiveClass: "active",
  routes: routes
})


export default router;
