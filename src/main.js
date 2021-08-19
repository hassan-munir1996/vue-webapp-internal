import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/assets/css/tailwind.css";
import VueCookies from 'vue-cookies';
/****************************************************/
Vue.use(VueCookies);
// Vue toast notification
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
Vue.use(VueToast, {
  // One of options
  position: 'top',
  duration: 2000
});

/****************************************************/
import { VueMasonryPlugin } from 'vue-masonry';
Vue.use(VueMasonryPlugin);

/****************************************************/

// v-click-outside
import vClickOutside from 'v-click-outside'
Vue.use(vClickOutside)

/****************************************************/

// vue magic grid
import MagicGrid from 'vue-magic-grid'
Vue.use(MagicGrid);

/****************************************************/


import ReadMore from 'vue-read-more';
Vue.use(ReadMore);
/****************************************************/

// vue tooltip
import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

/****************************************************/

// vue-modal
import { Modal, VoerroModal } from '@voerro/vue-modal';
Vue.component('modal', Modal);
window.VoerroModal = VoerroModal;

/****************************************************/
// vee-validate
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

/****************************************************/
// vue-ripple-directive
import Ripple from 'vue-ripple-directive';
Vue.directive('ripple', Ripple);

/****************************************************/
// vue-multiselect
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
Vue.component('multiselect', Multiselect);

/****************************************************/
// vue-loading-overlay
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
Vue.component('Loading', Loading);

/****************************************************/
// Font awesome icons
import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas)
library.add(fab)
library.add(far)
Vue.component('font-awesome-icon', FontAwesomeIcon)



/****************************************************/

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
