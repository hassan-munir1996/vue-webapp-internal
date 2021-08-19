import Vue from "vue"
import Vuex from "vuex"
import app from "./app"
import home from "./home"
import screen from "./screen"

Vue.use(Vuex)

export default new Vuex.Store({
  namespace: true,
  modules: {
    app,
    screen,
    home,

  }
})
//
