import Home from "@/pages/home/index.vue";
// import Login from "@/pages/login/index.vue";
import LayoutMix from '@/layout/layoutmix'
// 没有头部  没有左侧 空页面
import LayoutEmptyPage from '@/layout/layoutEmptyPage'
const routes = [
  {
    /**
     * path: 路径为 / 时触发该路由规则
     * name: 路由的 name 为 Home
     * component: 触发路由时加载 `Home` 组件
     */
    path: "/",
    name: "Home",
    // redirect: '/home',
    component: Home,
    // children: [
    //   {
    //     path: 'home',
    //     name: 'Home',
    //     component:  () => import('@/pages/home/index'),
    //   },
    // ]
  },
  // {
  //   path: "/admin/*",
  //   // name: "Admin",
  //   component: LayoutMix,
  // },
  // {
  //   path: "/vue2/*",
  //   // name: "Admin",
  //   component: LayoutMix,
  // },
  {
    path: "/login",
    name: "Login",
    component: () => import('@/pages/login/index'),
  }
];

export default routes;
