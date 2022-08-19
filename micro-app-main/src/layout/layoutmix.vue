<template>
  <a-config-provider prefixCls="cns">
    <section id="cns-main-app">
      <!-- <router-view /> -->
      <section class="cns-header-wrapper">
        <header-menu :menus="menus" @setFrameDomList="setFrameDomList" @setFrameIdShow="setFrameIdShow"  @changeHiddenMenu="changeHiddenMenu" :frameList="frameList"></header-menu>
      </section>
      <section
        :class="[
          'cns-content-wrapper',
          { 'cns-content-wrapper-footer': footerShow },
        ]"
      >
        <!-- 悬浮导航 -->
        <section id="cns-main-hiddenMenus" v-if="navBarType!=='fixed'">
          <hidden-menu :menus="menus" @setFrameDomList="setFrameDomList"  @changeHiddenMenu="changeHiddenMenu" v-show="hiddenMenusType" />
        </section>
        <!-- 左侧导航 -->
        <section class="cns-menu-left-wrapper" v-if="navBarType==='fixed'">
          <main-menu :menus="menus" @setFrameDomList="setFrameDomList" @setFrameIdShow="setFrameIdShow" :frameList="frameList"/>
        </section>
      <!-- 悬浮导航 -->
      <!-- <section class="cns-menu-wrapper">
        <main-menu :menus="menus" />
      </section> -->
        <section class="cns-frame-wrapper">
          <!-- 主应用渲染区，用于挂载主应用路由触发的组件 -->
          {{ $route.name }}
          <router-view v-show="$route.name" />
          <!-- 子应用渲染区，用于挂载子应用节点 -->
          <section v-show="!$route.name" id="frame">
            <!-- <section id="VueMicroApp"></section> -->
            <section v-for="item in frameList" :key="item.id" :id="item.id" v-show="frameIdShow === item.id">
            </section>
          </section> 
        </section>
      </section>
      <section v-if="footerShow" class="cns-footer-wrapper">底部</section>
    </section>
  </a-config-provider>
</template>

<script lang="ts">
// import axios from "axios";
// import {getStateAll} from "@/shared";
// import startQiankun from "./micro";
import {
  // registerMicroApps,
  // addGlobalUncaughtErrorHandler,
  // start,
  loadMicroApp,
  // initGlobalState,
} from "qiankun";
import config from "@/config";

console.log(config);
// const {
//   REACT_MICRO_APP,
//   VUE_MICRO_APP,
//   // ANGULAR_MICRO_APP,
//   // STATIC_MICRO_APP,
// } = config;
// console.log(REACT_MICRO_APP, VUE_MICRO_APP,)
import { Component, Vue, Watch } from "vue-property-decorator";
import actions from "@/shared/actions";

import MainMenu from "@/components/menu/index.vue";
import HeaderMenu from "@/components/header/index.vue";
import HiddenMenu from "@/components/hiddenMenu/index.vue";
import { setAddHeaderNav, getHeaderNav } from "@/utils/sessionStorageGetSet.ts";

type FrameListItem = {
  id: string,
  isUse: boolean,
  name: string,
  entry: string,
  microApp?: any,
 
}
@Component({
  components: {
    MainMenu,
    HeaderMenu,
    HiddenMenu,
  },
})
export default class App extends Vue {
  /**
   * 菜单列表
   * key: 唯一 Key 值
   * title: 菜单标题
   * path: 菜单对应的路径
   */
  menus = [
    {
      key: "Home",
      title: "主页",
      path: "/",
      isMicro: true,
    },
    // {
    //   key: "VueMicroApp",
    //   title: "子应用一",
    //   path: "/vue",
    //   children: [
    //     {
    //       parent: 'VueMicroApp',
    //       key: "VueMicroApp",
    //       title: "主页",
    //       path: "/vue",
    //       entry: 'http://localhost:10200'
    //     },
    //     {
    //       parent: 'VueMicroApp',
    //       key: "VueMicroApp",
    //       title: "列表页",
    //       path: "/vue/list",
    //       entry: 'http://localhost:10200'
    //     },
    //   ]
    // },
    {
      key: "VueMicroApp2",
      title: "子应用三",
      path: "/vue2",
      children: [
        {
          parent: 'VueMicroApp2',
          key: "VueMicroApp2",
          title: "主页",
          path: "/vue2",
          entry: 'http://localhost:10201'
        },
        {
          parent: 'VueMicroApp2',
          key: "VueMicroApp2",
          title: "列表页",
          path: "/vue2/list",
          entry: 'http://localhost:10201'
        },
        {
          parent: 'VueMicroApp2',
          key: "VueMicroApp2",
          title: "通信页",
          path: "/vue2/communication",
          entry: 'http://localhost:10201'
        },
      ]
    },
    // {
    //   key: "VueMicroApp3",
    //   title: "子应用四",
    //   path: "/vue3",
    //   entry: "http://localhost:7105"
    // },
    // {
    //   key: "ReactApp1",
    //   title: "react",
    //   path: "/react",
    //   entry: "http://localhost:10100"
    // },
    {
      key: "ReactApp2",
      title: "admin",
      path: "/admin",
      children: [
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "用户管理",
          path: "/admin/users",
          entry: "http://localhost:8000"
        },
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "组织结构",
          path: "/admin/domains",
          entry: "http://localhost:8000"
        },
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "组织职能关系",
          path: "/admin/competency",
          entry: "http://localhost:8000"
        },
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "业务委托关系",
          path: "/admin/entrust",
          entry: "http://localhost:8000"
        },
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "角色管理",
          path: "/admin/roles",
          entry: "http://localhost:8000"
        },
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "功能管理",
          path: "/admin/menus",
          entry: "http://localhost:8000"
        },
    //   ]
    // },
    // {
    //   key: "ReactApp2",
    //   title: "权限管理",
    //   path: "/admin",
    //   children: [
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "用户权限",
          path: "/admin/author/user/page",
          entry: "http://localhost:8000"
        },
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "用户按钮权限$",
          path: "/admin/author/button/page",
          entry: "http://localhost:8000"
        },
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "角色按钮权限$",
          path: "/admin/author/button/rolepage",
          entry: "http://localhost:8000"
        },
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "角色权限",
          path: "/admin/author/role/page",
          entry: "http://localhost:8000"
        },
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "角色权限查询$",
          path: "/admin/author/role/query",
          entry: "http://localhost:8000"
        },
        {
          parent: 'ReactApp2',
          key: "ReactApp2",
          title: "业务权限",
          path: "/admin/author/busi/page",
          entry: "http://localhost:8000"
        },
      ]
    }
  ];
  @Watch("$route.path")
  onPathChange() {
    // setTimeout(() => {
    //   this.ftameDomList = shared.getHeaderNav()
    //   console.log('appppppppp', shared.getHeaderNav())
    // }, 0)
  }
  // dom显示的index
  frameIdShow: string = '';
  frameList: FrameListItem[] = [
    {
      id: 'frame0',
      isUse: false,
      name: '',
      entry: ''
    }
  ]
  // 判断是否有底部数据
  footerShow: Boolean = false;
  navBarType: String = "fixed";
  hiddenMenusType:Boolean = false;
  created() {
    //  axios.get("/api/admin/user/search/?account=&roleCode=&type=&compCode=&deptCode=&pageNum=1&pageSize=100").then((Response) => {
    //   // let { footerShow, navBarType } = Response.data;
    //   console.log('Response',Response)
    //   // this.footerShow = Boolean(footerShow);
    //   // this.navBarType = navBarType;
    // });
    // axios.get("./setting.json").then((Response) => {
    //   let { footerShow, navBarType } = Response.data;
    //   this.footerShow = Boolean(footerShow);
    //   this.navBarType = navBarType;
    // });
    if (!this.$route.name) {
      for (let i = 0; i < this.menus.length; i++) {
        const menu = this.menus[i];
        const { path } = menu;
        if (path === this.$route.path) {
          console.log(menu)
          setAddHeaderNav(menu)
          break
        }
      }
    }
    this.$nextTick(() => {
      const headerNav = getHeaderNav()
      let activeNav = headerNav.filter((item: { path: string; }) => item.path == this.$route.path)
      if (activeNav.length > 0) {
        let obj = {
          ...this.frameList[0],
          isUse: true,
          name: activeNav[0].key,
          entry: activeNav[0].entry,
        }
        this.setFrameDomList(obj, 0)
      }
    })
  }
  private changeHiddenMenu(){
    this.hiddenMenusType = !this.hiddenMenusType
  }
  private addFrameList () {
     this.frameList.push({
      id: 'frame' + this.frameList.length,
      isUse: false,
      name: '',
      entry: '',
    })
  }
  private setFrameDomList(
    obj: FrameListItem,
    index: number
  ): void {
    this.frameIdShow = obj.id
    this.frameList[index] = obj
    let isUseFrameIndex = this.frameList.findIndex(obj => !obj.isUse)
    if (isUseFrameIndex === -1) {
      this.addFrameList()
    }
    this.$nextTick( () => {
      let appItem: any = {}
      // if (obj.name === 'VueMicroApp') {
        appItem = {
          name: obj.name,
          entry: obj.entry,
          container: '#' + obj.id,
          props: {
            id: '11111111111111111111',
            name: '刘关张',
            store: this
          }
        }
      // } else {
      //   appItem = {
      //     name: "VueMicroApp2",
      //     entry: REACT_MICRO_APP,
      //     container: '#' + obj.id,
      //     // activeRule: "/react"
      //   }
      // }

      this.frameList[index].microApp = loadMicroApp(
        appItem,
        { sandbox: { experimentalStyleIsolation: true } }
      )
    })
  }
  private setFrameIdShow(
    name: string
  ): void {
    this.frameIdShow = name
  }
}
</script>

<style lang="less" scoped>
#cns-main-app {
  height: 100%;
  position: relative;
  overflow: hidden;
  // 头部
  .cns-header-wrapper {
    width: 100%;
    height: 50px;
    overflow: hidden;
  }
  // 主题
  .cns-content-wrapper {
    display: flex;
    position: relative;
    width: 100%;
    height: calc(100vh - 50px);
    overflow: hidden;
    // 左侧导航
    .cns-menu-left-wrapper {
      flex: 180px 0 0;
      height: 100%;
      overflow-y: auto;
    }
    // 悬浮导航
    .cns-menu-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      max-height: 100%;
      background: #f0f;
      overflow-y: auto;
      z-index: 20;
    }
    // 内容
    .cns-frame-wrapper {
      flex: 1;
      height: 100%;
      overflow-y: auto;
    }
  }
  .cns-content-wrapper-footer {
    height: calc(100vh - 70px);
  }
  // 底部
  .cns-footer-wrapper {
    width: 100%;
    height: 20px;
    background: -webkit-gradient(
      linear,
      right top,
      left top,
      from(#4e92f5),
      to(#3469c6)
    );
    background: linear-gradient(-90deg, #4e92f5, #3469c6);
    overflow: hidden;
  }
  #frame {
    padding: 16px;
    width: 100%;
    height: 100%;
    section {
      width: 100%;
      height: 100%;
    }
  }
  #cns-main-hiddenMenus {
    z-index: 30;
    position: fixed;
    left: 0;
    top: 50px;
  }
}
</style>
