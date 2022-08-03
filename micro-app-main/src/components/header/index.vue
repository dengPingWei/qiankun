<template>
  <div class="header-qk">
    <div class="anticon">
      <img src="../../assets/vh-menu.png" alt="">
    </div>
    <div class="logo">
      <img src="../../assets/oes-logo-v6-dark.png" alt="">
    </div>
    <div class="header-nav">
        <div v-for="(item, index) in menus" :key="item.key" class="heade-nav-item" @click="changeMenu(item)">
          <div class="option-container">
            <span @click.stop="deleteMenu(index, item)">×</span>
          </div>
          <router-link :to="{path: item.path }">
            <span class="nav-name" :class="{ 'nav-name-active ': selectKey === item.key }">{{item.title}}</span>
          </router-link>
        </div>
    </div>
    <div class="header-right"></div>
  </div>
</template>

<script lang="ts">
import shared from "@/shared";
import { Component, Vue, Watch } from "vue-property-decorator";

type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  path: string;
  children?: MenuItem[];
};
@Component({
  components: {
    HeaderMenu
  }
})
export default class HeaderMenu extends Vue {
  @Watch("$route.path")
  onPathChange() {
    setTimeout(() => {
      this.menus = shared.getHeaderNav()
      this._initMenus()
    }, 100)
  }
  selectKey: string = "";
  menus: MenuItem[] = []
  created() {
    this.menus = shared.getHeaderNav()
    this._initMenus()
  }
  private _initMenus() {
    const currentMenu = this._findCurrentMenu(
      this.menus,
      this.$route.path
    ) as MenuItem;
    if (!currentMenu) {
      this.selectKey = ''
      return
    }
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
    const { key } = item
    this.selectKey = key
  }
  /**
   * 删除菜单
   */
  private deleteMenu(index: number, item: MenuItem) {
    let headerNav = [ ...shared.getHeaderNav() ]
    console.log(headerNav)
    if (item.key ===this.selectKey) {
      if(headerNav[index + 1]) {
        this.$router.push(headerNav[index + 1].path)
      } else if(headerNav[index - 1]) {
        this.$router.push(headerNav[index - 1].path)
      } else {
        this.$router.push('/')
      }
    }
    headerNav.splice(index, 1)
    shared.setHeaderNav(headerNav)
    this.menus = headerNav
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
    padding: 0 10px;
    padding-bottom: 10px;
    font-size: 14px;
    .heade-nav-item {
      position: relative;
      float: left;
      padding: 0 8px;
      padding-top: 14px;
      .option-container {
        display: none;
        position: absolute;
        top: 4px;
        right: 8px;
        height: 12px;
        line-height: 10px;
        cursor: pointer;
        span {
          width: 10px;
          height: 10px;
        }
      }
      a {
        color: #fff;
        text-decoration:none;
      }
      .nav-name {
        padding-bottom: 2px;
        border-bottom: 2px solid transparent;
      }
      .nav-name-active {
        border-bottom: 2px solid #fff;
      }
    }
    .heade-nav-item:hover .option-container {
      display: block;
    }
  }
  
  .header-right {
    width: 300px;
    // height: 100%;
    background: #332; 
  }
}
</style>