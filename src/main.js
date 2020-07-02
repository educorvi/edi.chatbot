import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


new Vue({
  render: h => h(App),
}).$mount('#app')
