import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/heart",
      name: "heart",
      // route level code-splitting
      // this generates a separate chunk (heart.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "heart" */ "./views/HeartRate.vue")
    },
    {
      path: "/myo",
      name: "myo",
      component: () =>
        import(/* webpackChunkName: "myo" */ "./views/MyoArmBand.vue")
    },
    {
      path: "/drone",
      name: "drone",
      component: () =>
        import(/* webpackChunkName: "drone" */ "./views/Drone.vue")
    },
    {
      path: "/printer",
      name: "printer",
      component: () =>
        import(/* webpackChunkName: "printer" */ "./views/ThermalPrinter.vue")
    },
    {
      path: "/adb",
      name: "adb",
      component: () => import(/* webpackChunkName: "adb" */ "./views/Adb.vue")
    },
    {
      path: "/nfc",
      name: "nfc",
      component: () => import(/* webpackChunkName: "nfc" */ "./views/Nfc.vue")
    },
    {
      path: "/webshop",
      name: "webshop",
      component: () =>
        import(/* webpackChunkName: "webshop" */ "./views/Webshop.vue")
    }
  ]
});
