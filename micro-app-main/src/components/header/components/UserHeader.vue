<template>
  <div class="header-user">
    <div class="user">
      <span class="portrait">
        <img src="../../../assets/defaultAvatar.png" alt="">
      </span>
      <span class="name">{{ 'admin' }}</span>
      <div class="user-operation">
        <ul>
          <li>修改密码</li>
          <li @click="exitLogin">退出登录</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, } from "vue-property-decorator";
@Component({
  components: {
    HeaderMenu
  }
})
export default class HeaderMenu extends Vue {
  navWidthAll: number = 0;  // nav总宽度
  leftWidth: number = 0; // 左移位置
  oneNavIndex: number = 0; // 当前第一个的位置
  headeNavWidth: number = 0; // 导航dom宽度
  created() {}

  exitLogin() {
    // alert('退出')
    sessionStorage.clear()
    this.$router.push('/login')
  }
}
</script>

<style lang="less" scoped>
.header-user {
  padding-right: 12px;
  height: 100%;
  .user {
    display: flex;
    position: relative;
    float: right;
    padding: 0 8px;
    height: 100%;
    cursor: pointer;
    .portrait {
      margin: auto 0;
      width: 24px;
      height: 24px;
      img {
        width: 100%;
      }
    }
    .name {
      margin-left: 8px;
      line-height: 50px;
    }
    .user-operation {
      display: none;
      position: absolute;
      top: 50px;
      right: 0;
      padding: 4px 0;
      width: 110px;
      z-index: 999;
      ul {
        padding: 4px 0;
        line-height: 1.5;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
        text-align: left;
        background-color: #fff;
        box-shadow: 0 2px 8px #00000026;
        background-clip: padding-box;
        outline: none;
        li {
          padding: 5px 12px;
          font-weight: normal;
          white-space: nowrap;
          cursor: pointer;
          -webkit-transition: all .3s;
          transition: all .3s;
          line-height: 22px;
          list-style-type:none;
        }
        li:hover {
          background-color: #e6f7ff;
        }
      }
    }
  }
  .user:hover .user-operation {
    display: block;
  }
  .user:hover {
    background: #ffffff33;
  }
}
</style>