import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import './styles.scss'

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)


import VueI18n from 'vue-i18n';
import messages from './lang';
import router from './router'
Vue.use(VueI18n);
export const i18n = new VueI18n({
  locale: 'de',
  fallbackLocale: 'de',
  messages
});

new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
