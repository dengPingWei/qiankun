<template>
  <div class="header-qk">
    <div class="anticon" @click="navIconClick">
      <img src="../../assets/vh-menu.png" alt="">
    </div>
    <div class="logo">
      <img src="../../assets/oes-logo-v6-dark.png" alt="">
    </div>
    <div class="header-nav">
      <div v-for="(item, index) in menus" :key="item.path" class="heade-nav-item" @click="changeMenu(item)">
        <div class="option-container">
          <span @click.stop="deleteMenu(index, item)">×</span>
        </div>
        <!-- <router-link :to="{path: item.path }">
          <span class="nav-name" :class="{ 'nav-name-active ': selectKey === item.key }">{{item.title}}</span>
        </router-link> -->
        <div>
            <span class="nav-name" :class="{ 'nav-name-active ': selectKey === item.path }">{{item.title}}</span>
        </div>
        </div>
    </div>
    <div class="header-right"></div>
  </div>
</template>

<script lang="ts">
// import shared from "@/shared";
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { setHeaderNav,getHeaderNav } from "@/utils/sessionStorageGetSet.ts";
type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  path: string;
  entry: string;
  children?: MenuItem[];
};
type FrameListItem = {
  id: string,
  isUse: boolean,
  name: string,
  microApp: any
}
@Component({
  components: {
    HeaderMenu
  }
})
export default class HeaderMenu extends Vue {
  @Prop({ type: Array, default: [] })
  frameList!: FrameListItem[];

  @Watch("$route.path")
  onPathChange() {
    setTimeout(() => {
      this.menus = getHeaderNav()
      this._initMenus()
    }, 100)
  }
  selectKey: string = "";
  menus: MenuItem[] = []
  created() {
    this.menus = getHeaderNav()
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
    const { path } = currentMenu;
    this.selectKey = path;
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
    const { path } = item
    if (this.selectKey === path) return
    this.selectKey = path
    this.$router.push(path)
    this.getFrameDomActive(item)
  }
  /**
   * 头部导航子应用Dom切换
  */
  private getFrameDomActive (item: MenuItem) {
    let { key } = item
    let frameActiveIndex = this.frameList.findIndex(obj => obj.name === key)
    // 判断是否在已有的Dom中
    if (frameActiveIndex > -1) {
      this.$emit('setFrameIdShow', this.frameList[frameActiveIndex].id)
    } else {
      this.setFrameDomList(item)
    }
  }
  private setFrameDomList (item: MenuItem) {
    let { key, entry } = item
    const headerNav = getHeaderNav()
    // 先找没有占用dom
    let isUseFrameIndex = this.frameList.findIndex(obj => !obj.isUse)
    if(isUseFrameIndex > -1) {
      let obj = {
        ...this.frameList[isUseFrameIndex],
        isUse: true,
        name: key,
        entry,
      }
      this.$emit('setFrameDomList', obj, isUseFrameIndex)
    } else {
      for (let i = 0; i < headerNav.length; i++) {
        let frameIndex = this.frameList.findIndex(obj => obj.name === headerNav[i].key)
        if (frameIndex > -1) {
          let obj = {
            ...this.frameList[frameIndex],
            isUse: true,
            name: key,
            entry,
          }
          this.$emit('setFrameDomList', obj, frameIndex)
          break
        }
      }
    }
  }
  /**
   * 删除菜单
   */
  private deleteMenu(index: number, item: MenuItem) {
    let headerNav = [ ...getHeaderNav() ]
    let activeItem:any = {},isHome = false
    if (item.path === this.selectKey) {
      if(headerNav[index + 1]) {
        this.$router.push(headerNav[index + 1].path)
        activeItem = headerNav[index + 1]
      } else if(headerNav[index - 1]) {
        this.$router.push(headerNav[index - 1].path)
        activeItem = headerNav[index - 1]
      } else {
        isHome = true
        this.$router.push('/')
      }
    }
    this.deleteFrameList(item.key, activeItem, isHome)
    headerNav.splice(index, 1)
    setHeaderNav(headerNav)
    this.menus = headerNav
  }
  private deleteFrameList(key: string, activeItem: MenuItem, isHome: boolean) {
    let frameSame = getHeaderNav().filter((obj: { key: string; }) => obj.key === key)
    // let isFrameUnmount: any
    console.log('this.frameList)----------------',this.frameList)
    this.frameList.map(item => {
      // 判断是否是回到主页
      if(isHome) {
        item.name = ''
        item.isUse = false
      } else {
        if (key === item.name && frameSame.length < 2) {
          item.name = ''
          item.isUse = false
          item.microApp.unmount()
        }
      }
      return item
    })
    // if (isFrameUnmount) {
    //   isFrameUnmount.unmount()
    // }
    if (activeItem.key) {
      this.getFrameDomActive(activeItem)
    }
    // 改变dom是否占用的状态

    //  this.$emit('setFrameDomList', obj, frameIndex)
    // console.log(activeItem, this.frameList)
    // for (let i=0; i<this.frameList.length; i++) {
    //   if (key，) {
    //     return i
    //   }
    // }
  }
  private navIconClick(){
    this.$emit('changeHiddenMenu')
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
      cursor: pointer;
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
    // background: #332; 
  }
}
</style>