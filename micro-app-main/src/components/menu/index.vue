<template>
  <section class="cns-main-menu">
    <a-menu mode="inline" theme="dark" :selectedKeys="[selectKey]" style='background:linear-gradient(-90deg, #4e92f5, #3469c6)'>
      <a-menu-item v-for="item in menus" :key="item.key" @click="changeMenu(item)">
        <router-link :to="{path: item.path }">
          <a-icon v-if="item.icon" :type="item.icon" />
          <span>{{item.title}}</span>
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
import shared from "@/shared";
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
export default class Menu extends Vue {
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
    if (path !== '/') {
      shared.setAddHeaderNav(item)
      this.$emit('setFtameDomList');
    }
     
  }
}
</script>

<style lang="less" scoped>
.cns-main-menu {
  width: 100%;
  height: 100%;
   background: -webkit-gradient(linear, right top, left top, from(#4e92f5), to(#3469c6));
    background: linear-gradient(-90deg, #4e92f5, #3469c6);
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