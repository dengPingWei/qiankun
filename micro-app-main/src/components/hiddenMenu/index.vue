<template>
  <section class="cns-main-menu" @click="navIconClick">
    <a-menu
      mode="inline"
      theme="dark"
      :selectedKeys="[selectKey]"
      class="menuList"
      style="
        background: linear-gradient(-90deg, #4e92f5, #3469c6);
      "
    >
      <a-menu-item
        v-for="item in menus"
        :key="item.key"
        @click.stop="changeMenu(item)"
      >
        <router-link :to="{ path: item.path }">
          <a-icon v-if="item.icon" :type="item.icon" />
          <span>{{ item.title }}</span>
        </router-link>
        <!-- <div>
          <a-icon v-if="item.icon" :type="item.icon" />
          <span>{{item.title}}</span>
        </div> -->
      </a-menu-item>
    </a-menu>
  </section>
</template>

<script lang="ts">
// import shared from "@/shared";
import { setAddHeaderNav } from "@/utils/sessionStorageGetSet.ts";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  path: string;
  isMicro?: boolean;
  children?: MenuItem[];
};

@Component
export default class Hiddenmenu extends Vue {
  @Prop({ type: Array, default: [] })
  menus!: MenuItem[];

  @Watch("$route.path")
  onPathChange() {
    this._initMenus();
  }

  selectKey: string = "";

  created() {
    this._initMenus();
  }

  private _initMenus() {
    const currentMenu = this._findCurrentMenu(
      this.menus,
      this.$route.path
    ) as MenuItem;
    if (!currentMenu) return;
    const { key } = currentMenu;
    this.selectKey = key;
  }

  private _findCurrentMenu(
    menus: MenuItem[],
    currentPath: string
  ): MenuItem | null {
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      const { path } = menu;
      if (path === currentPath) return menu;

      const currentMenu = this._findCurrentMenu(
        menu.children || [],
        currentPath
      );
      if (currentMenu) return currentMenu;
    }
    return null;
  }

  /**
   * 切换菜单
   */
  private changeMenu(item: MenuItem) {
    const { key, path } = item;
    this.selectKey = key;
    if (path !== "/") {
      console.log('222222222222222222')
      setAddHeaderNav(item);
      this.$emit("setFrameDomList");
    }
  }

  private navIconClick() {
    this.$emit("changeHiddenMenu");
  }
}
</script>

<style lang="less" scoped>
.cns-main-menu {
  width: 100vw;
  height: calc(100pvh - 50px);
  //  background: -webkit-gradient(linear, right top, left top, from(#4e92f5), to(#3469c6));
  //   background: linear-gradient(-90deg, #4e92f5, #3469c6);
  inset: 50px 0px 0px;
  opacity: 1;
  visibility: visible;
  transition: opacity 0.3s ease-out 0s, visibility 0.3s ease-out 0s;
  background-color: rgba(0, 0, 0, 0.3);
  .cns-menu {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    a {
      color: #fff;
      text-decoration: none;
    }
  }
  .menuList{
        max-width: 150px;
    background: linear-gradient(-90deg, rgb(78, 146, 245), rgb(52, 105, 198));
    height: 75vh;
  }
  .cns-parent-title {
    font-size: 13px;
    color: rgba(233, 241, 255, 0.75);
  }
  .cns-child-title {
    font-size: 13px;
    color: #fff;
  }
  .cns-child-title:hover {
    color: #408fff;
  }
  /deep/ .cns-menu-sub {
    background: rgb(12, 28, 53);
  }
}
</style>