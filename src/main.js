import Vue from 'vue';
import App from './App.vue';
import store from './store';
import { CoolSelectPlugin } from 'vue-cool-select';

import './assets/css/base.scss';

Vue.config.productionTip = false

Vue.use(CoolSelectPlugin);
Vue.use(require('vue-moment'));

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
