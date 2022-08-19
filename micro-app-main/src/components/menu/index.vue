<template>
  <section class="cns-main-menu">
    <a-menu
      :openKeys="[openKeys]"
      :selectedKeys="[selectKey]"
      mode="inline"
      class="menuList"
    >
      <template v-for="item in menus">
        <a-menu-item v-if="!item.children" :key="item.path" @click="changeMenu(item)">
          <router-link :to="{path: item.path }">
            <a-icon v-if="item.icon" :type="item.icon" />
            <span>{{ item.title }}</span>
          </router-link>
        </a-menu-item>
        <a-sub-menu v-else :key="item.key" @titleClick="changeSubMenu">
          <template #title>{{ item.title }}</template>
          <a-menu-item v-for="chilItem in item.children" :key="chilItem.path" @click="changeMenu(chilItem)">
            <router-link :to="{path: chilItem.path }">
              <a-icon v-if="chilItem.icon" :type="chilItem.icon" />
              <span>{{ chilItem.title }}</span>
            </router-link>
          </a-menu-item>
        </a-sub-menu>
      </template>
    </a-menu>
    <div class="footer">
      <MenuFooter/>
    </div> 
  </section>
</template>

<script lang="ts">
import subMenu from "./subMenu.vue";
import { setAddHeaderNav } from "@/utils/sessionStorageGetSet.ts";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import MenuFooter from "@/components/menuFooter/index.vue";

type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  path: string;
  isMicro?: boolean;
  parent?: string,
  children?: MenuItem[];
};
type FrameListItem = {
  id: string,
  isUse: boolean,
  name: string
}
@Component({
  components: {
    subMenu,
    Menu,
    MenuFooter
  }
})
export default class Menu extends Vue {
  @Prop({ type: Array, default: [] })
  menus!: MenuItem[];

  @Prop({ type: Array, default: [] })
  frameList!: FrameListItem[];

  @Watch("$route.path")
  onPathChange() {
    this._initMenus();
  }
  selectKey: string = '';
  openKeys: string = '';
  created() {
    this._initMenus();
  }
  private _initMenus() {
    const currentMenu = this._findCurrentMenu(
      this.menus,
      this.$route.path
    ) as MenuItem;
    if (!currentMenu) return;
    if(this.selectKey == this.$route.path) return
    const { path,parent = '' } = currentMenu;
    this.selectKey = path;
    this.openKeys = parent || this.openKeys;
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
  // private changeMenu(item: MenuItem) {
   private changeMenu(item: any) {
    const { key, path } = item;
    this.selectKey = path;
    if (path !== '/') {
      setAddHeaderNav(item)
      console.log(this.frameList)
      let frameActiveIndex = this.frameList.findIndex(obj => obj.name === key)
      // 判断是否在已有的Dom中
      if (frameActiveIndex > -1) {
        this.$emit('setFrameIdShow', this.frameList[frameActiveIndex].id)
      } else {
        const frameObj: any  = this.getFrameListIndex(item)
        this.$emit('setFrameDomList', frameObj.obj, frameObj.index);
      }
    }
  }
  private changeSubMenu (item: any) {
    if(item.key === this.openKeys ) {
       this.openKeys = "" 
    } else {
      this.openKeys = item.key
    }
  }
  private getFrameListIndex(item: any) {
    const { key, entry } = item;
    let obj = {
      ...this.frameList[0],
      name: key,
      entry,
    }
    // 没有被占用的
    let isUseFrameIndex = this.frameList.findIndex(obj => !obj.isUse)
    obj = {
      ...this.frameList[isUseFrameIndex],
      isUse: true,
      name: key,
      entry,
    }
    return { obj, index: isUseFrameIndex }
  }
}
</script>

<style lang="less" scoped>
.cns-main-menu {
  position: relative;
  padding-bottom: 25px;
  width: 100%;
  height: 100%;
  border-right: 1px solid #e8e8e8;
  // background: -webkit-gradient(linear, right top, left top, from(#4e92f5), to(#3469c6));
  // background: linear-gradient(-90deg, #4e92f5, #3469c6);
  .cns-menu {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 4px;
      height: 4px;
      background: #fff;
    }
    
    &::-webkit-scrollbar-track {
      background: none;
    }
    
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 3px;
      background-color: #d9d9d9;
    }
    a {
      // color: #fff;
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
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 25px;
  }
  /deep/ .cns-menu-inline {
    border-right: none;
  }
  /deep/.cns-menu-inline .cns-menu-item,
  /deep/.cns-menu-inline .cns-menu-submenu-title {
    width: 100%;
  }
}
</style>