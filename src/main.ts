import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import ErrorHandler from "./lib/error";
import "./registerServiceWorker";

ErrorHandler.init();
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
