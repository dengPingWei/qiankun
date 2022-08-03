<template>
  <a-config-provider prefixCls="cns">
    <section id="cns-main-app">
      <section class="cns-header-wrapper">
        <header-menu :menus="menus"></header-menu>
      </section>
      <section
        :class="[
          'cns-content-wrapper',
          { 'cns-content-wrapper-footer': footerShow },
        ]"
      >
        <!-- 左侧导航 -->
        <section class="cns-menu-left-wrapper">
          <main-menu :menus="menus" @setFtameDomList="setFtameDomList"/>
        </section>
        <!-- 悬浮导航 -->
        <!-- <section class="cns-menu-wrapper">
          <main-menu :menus="menus" />
        </section> -->
        <section class="cns-frame-wrapper">
          <!-- 主应用渲染区，用于挂载主应用路由触发的组件 -->
          <router-view v-show="$route.name" />
          <!-- 子应用渲染区，用于挂载子应用节点 -->
          <section v-show="!$route.name" id="frame">
            <!-- <section id="VueMicroApp"></section> -->
            <section v-for="item in ftameDomList" :key="item.key" :id="item.key"></section>
          </section>
        </section>
      </section>
      <section v-if="footerShow" class="cns-footer-wrapper">底部</section>
    </section>
  </a-config-provider>
</template>

<script lang="ts">
import axios from "axios";
import shared from "@/shared";
import { Component, Vue, Watch } from "vue-property-decorator";

import MainMenu from "@/components/menu/index.vue";
import HeaderMenu from "@/components/header/index.vue";
@Component({
  components: {
    MainMenu,
    HeaderMenu,
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
      isMicro: true
    },
    {
      key: "VueMicroApp",
      title: "子应用一",
      path: "/vue",
    },
//     {
//       key: "VueMicroAppList",
//       title: "子应用二",
//       path: "/vue/list",
//     },
    {
      key: "ReactMicroApp",
      title: "子应用三",
      path: "/react",
    },
    {
      key: "AngularMicroApp",
      title: "子应用四",
      path: "/angular",
    },
    {
      key: "AngularMicroAppList",
      title: "子应用四List",
      path: "/angular/list",
    },
    {
      key: "StaticMicroApp",
      title: "微应用",
      path: "/static",
    },
  ];
  @Watch("$route.path")
  onPathChange() {
    // setTimeout(() => {
    //   this.ftameDomList = shared.getHeaderNav()
    //   console.log('appppppppp', shared.getHeaderNav())
    // }, 0)
  }
  // dom
  ftameDomList = [];
  // 判断是否有底部数据
  footerShow: Boolean = true;
  navBarType:String = 'fixed'
  created() {
    axios.get('./setting.json').then(Response=>{
      let {footerShow,navBarType} = Response.data;
      console.log(Boolean(footerShow));
      
      this.footerShow = Boolean(footerShow);
      this.navBarType = navBarType
      
    })
    if (!this.$route.name) {
      for (let i = 0; i < this.menus.length; i++) {
        const menu = this.menus[i];
        const { path } = menu;
        if (path === this.$route.path) {
          shared.setAddHeaderNav(menu)
          this.ftameDomList = shared.getHeaderNav()
          break
        }
      }
    }
  }
  private setFtameDomList(
    menus: []
  ): void {
    console.log('okokoko')
    this.ftameDomList = menus
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
    background: -webkit-gradient(linear, right top, left top, from(#4e92f5), to(#3469c6));
    background: linear-gradient(-90deg, #4e92f5, #3469c6);
    overflow: hidden;
  }
  #frame {
    width: 100%;
    height: 100%;
    background: rgb(196, 188, 188);
  }
}
</style>
