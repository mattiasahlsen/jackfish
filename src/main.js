// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueWorker from 'vue-worker'
Vue.use(VueWorker)

import $ from 'jquery';
window.$ = window.jquery = $;

// this might require the jquery variable to be available
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
