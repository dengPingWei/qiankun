<template>
  <div class="header-nav">
    <div v-if="headeNavWidth < (navWidthAll - leftWidth)" class="arrow left-arrow" @click="leftClick">&lt;</div>
    <div v-if="oneNavIndex > 0" class="arrow right-arrow" @click="rightClick">&gt;</div>
    <div class="heade-nav-p" ref="headeNav">
      <div class="heade-nav-all" :style="{minWidth: headeNavWidth + 'px', width: navWidthAll + 'px', left: leftWidth*-1 + 'px' }">
        <div v-for="(item, index) in menus" :key="item.path" class="heade-nav-item" @click="changeMenu(item)">
          <div class="option-container">
            <span @click.stop="deleteMenu(index, item)">×</span>
          </div>
          <div>
            <span class="nav-name" :class="{ 'nav-name-active ': selectKey === item.path }">{{item.title}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import { setHeaderNav,getHeaderNav } from "@/utils/sessionStorageGetSet.ts";
type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  path: string;
  entry: string;
  width: number;
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
    NavHeader
  }
})
export default class NavHeader extends Vue {
  @Prop({ type: Array, default: [] })
  frameList!: FrameListItem[];

  @Watch("$route.path")
  onPathChange() {
    setTimeout(() => {
      this.menus = getHeaderNav()
      this.getNavAllWidth()
      this._initMenus()
    }, 100)
  }
  selectKey: string = "";
  menus: MenuItem[] = [];
  navWidthAll: number = 0;  // nav总宽度
  leftWidth: number = 0; // 左移位置
  oneNavIndex: number = 0; // 当前第一个的位置
  headeNavWidth: number = 0; // 导航dom宽度
  created() {
    this.menus = getHeaderNav()
    this._initMenus()
    this.getNavAllWidth()
    this.$nextTick(() => {
      this.headeNavWidth = this.$refs.headeNav.offsetWidth
    })
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
    if(currentPath === '/') return null;
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
  private getNavAllWidth () {
    let allWidth = 0
    let nav = this.menus
    for(let i = 0; i < nav.length; i++) {
      allWidth += nav[i].width
    }
    this.navWidthAll = allWidth
  }
  // 左移动
  leftClick () {
    const isWidth =  this.menus[this.oneNavIndex].width
    this.leftWidth += isWidth
    this.oneNavIndex ++
  }
  // 右移动
  rightClick () {
    this.oneNavIndex --
    const isWidth =  this.menus[this.oneNavIndex].width
    this.leftWidth -= isWidth
  }
  /**
   * 切换菜单
   */
  changeMenu(item: MenuItem) {
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
  deleteMenu(index: number, item: MenuItem) {
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
    this.getNavAllWidth()
  }
  private deleteFrameList(key: string, activeItem: MenuItem, isHome: boolean) {
    let frameSame = getHeaderNav().filter((obj: { key: string; }) => obj.key === key)
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
    if (activeItem.key) {
      this.getFrameDomActive(activeItem)
    }
  }
}
</script>

<style lang="less" scoped>
.header-nav {
  position: relative;
  padding: 0 34px;
  height: 100%;
  font-size: 14px;
  overflow: hidden;
  .arrow {
    display: none;
    position: absolute;
    width: 30px;
    height: 100%;
    // background: #ff0;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }
  .left-arrow {
    left: 0;
  }
  .right-arrow {
    right: 0;
  }
  .heade-nav-p {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .heade-nav-all {
    position: absolute;
    left: 0;
    height: 100%;
  }
  .heade-nav-item {
    // display:inline-block;
    position: relative;
    float: left;
    padding: 0 8px;
    padding-top: 14px;
    height: 100%;
    // white-space:nowrap;
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
.header-nav:hover .arrow {
  display: block;
}
</style>