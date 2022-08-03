<template>
  <div class="header-qk">
    <div class="anticon">
      <img src="../../assets/vh-menu.png" alt="">
    </div>
    <div class="logo">
      <img src="../../assets/oes-logo-v6-dark.png" alt="">
    </div>
    <div class="header-nav"></div>
    <div class="header-right"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  path: string;
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
    const { key } = item;
    this.selectKey = key;
  }
}
</script>

<style lang="less" scoped>
.header-qk {
  display: flex;
  width: 100%;
  height: 100%;
  background: linear-gradient(-90deg,#4e92f5,#3469c6);
  color: #fff;
  .anticon {
    display: flex;
    width: 50px;
    background: #0e479d;
    cursor: pointer;
    img {
      margin: auto;
      height: 22px; 
    }
  }
  .logo {
    display: flex;
    width: 190px;
    cursor: pointer;
    img {
      margin: auto;
      height: 24px; 
    }
  }
  .header-nav {
    flex: 1;
    // background: #0f0; 
  } 
  .header-right {
    width: 300px;
    // height: 100%;
    // background: #332; 
  }
}
</style>