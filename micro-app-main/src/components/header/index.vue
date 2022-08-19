<template>
  <div class="header-qk">
    <div class="anticon" @click="navIconClick">
      <img src="../../assets/vh-menu.png" alt="">
    </div>
    <div class="logo"  @click="logoClick">
      <img src="../../assets/oes-logo-v6-dark.png" alt="">
    </div>
    <div class="header-nav">
      <NavHeader :frameList="frameList" :setFrameIdShow="setFrameIdShow" :setFrameDomList="setFrameDomList"/>
    </div>
    <div class="header-right">
      <UserHeader/>
    </div>
  </div>
</template>

<script lang="ts">
// import shared from "@/shared";
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
import NavHeader from "./components/NavHeader.vue";
import UserHeader from "./components/UserHeader.vue";
type FrameListItem = {
  id: string,
  isUse: boolean,
  name: string,
  microApp: any
}
@Component({
  components: {
    HeaderMenu,
    NavHeader,
    UserHeader
  }
})
export default class HeaderMenu extends Vue {
  @Prop({ type: Array, default: [] })
  frameList!: FrameListItem[];

  @Watch("$route.path")
  onPathChange() {
  }
  created() {}

  setFrameIdShow(id: string) {
   this.$emit('setFrameIdShow', id)
  }
  setFrameDomList(obj: any, index: number) {
    this.$emit('setFrameDomList', obj, index)
  }
  navIconClick(){
    this.$emit('changeHiddenMenu')
  }
  logoClick(){
    console.log('logo')
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
  }
  
  .header-right {
    width: 300px;
    // height: 100%;
    // background: #332; 
  }
}
</style>