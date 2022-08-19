<template>
  <section class="cns-main-menu" @click="navIconClick">
    <div class="menuList">
      <a-menu
        mode="inline"
        :openKeys="[openKeys]"
        :selectedKeys="[selectKey]"
        class="menuList-nav"
      >
        <template v-for="item in menus">
          <a-menu-item v-if="!item.children" :key="item.path" @click.stop="changeMenu(item)">
            <router-link :to="{path: item.path }">
              <a-icon v-if="item.icon" :type="item.icon" />
              <span>{{ item.title }}</span>
            </router-link>
          </a-menu-item>
          <a-sub-menu v-else :key="item.key" @titleClick="changeSubMenu($event)">
            <template #title>{{ item.title }}</template>
            <a-menu-item v-for="chilItem in item.children" :key="chilItem.path" @click.stop="changeMenu(chilItem)">
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
    </div>
    
  </section>
</template>

<script lang="ts">
// import shared from "@/shared";
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
    Hiddenmenu,
    MenuFooter
  }
})
export default class Hiddenmenu extends Vue {
  @Prop({ type: Array, default: [] })
  menus!: MenuItem[];
  
  @Prop({ type: Array, default: [] })
  frameList!: FrameListItem[];

  @Watch("$route.path")
  onPathChange() {
    this._initMenus();
  }

  selectKey: string = "";
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
  // 
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
    this.$emit("changeHiddenMenu");
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
  private changeSubMenu (item: any) {
    item.domEvent.stopPropagation()
    if(item.key === this.openKeys ) {
       this.openKeys = "" 
    } else {
      this.openKeys = item.key
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
  height: calc(100vh - 50px);
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
    overflow: hidden;
    a {
      text-decoration: none;;
    }
  }
  .menuList {
    padding-bottom: 25px;
    position: relative;
    max-width: 180px;
    height: 75vh;
    background: #fff;
    border-right: 1px solid #00000026;

    .menuList-nav {
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
    }
    
  }
  .footer {
    position: absolute;
    bottom: 0;
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
  /deep/ .cns-menu-inline {
  //  border-right: none;
  }
}
</style>