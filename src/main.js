import Vue from 'vue';
import Web3 from 'web3';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

// eslint-disable-next-line no-multi-assign
Vue.prototype.$web3 = Vue.web3 = new Web3(Web3.givenProvider);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
