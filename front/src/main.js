import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import Login from "./components/login.vue";
import SendMessage from "./components/sendmessage.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/login", component: Login },
  { path: "/sendmessage", component: SendMessage },
  // {path: "/msgroom", component: MsgRoom}
];

const router = new VueRouter({
  mode: "history",
  routes,
});

new Vue({
  el: "#app",
  router,
  render: (h) => {
    return h(App);
  },
});