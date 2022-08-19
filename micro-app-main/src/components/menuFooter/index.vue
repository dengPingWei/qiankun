<template>
  <div class="menu-footer">
    <img class="logo" src="../../assets/vh-logo-v6.png" alt="">
    <img class="name" src="../../assets/vh-slogan.png" alt="">
  </div>
</template>

<script lang="ts">
// import shared from "@/shared";
import { Component, Vue} from "vue-property-decorator";

@Component({
  components: {
    MenuFooter
  }
})
export default class MenuFooter extends Vue { 
}
</script>

<style lang="less" scoped>
.menu-footer {
  display: flex;
  padding-left: 8px;
  width: 100%;
  height: 25px;
  // background: #ff0;
  align-items: center;
  img {
    height: 14px;
    width: auto;
    vertical-align: middle;
    border-style: none;
  }
}
</style>