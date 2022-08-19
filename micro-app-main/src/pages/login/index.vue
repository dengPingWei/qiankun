<template>
  <section class="login-container">
    <div style="margin-bottom: 20px;">
      <span>Cookie：</span>
      <input type="text" v-model="cookieVal"/>
    </div>
    <p v-show="hint" class="hint">{{ hint }}</p>
    <a-button size="large" type="primary" @click="login">登录</a-button>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
/* eslint-disable */
import VueRouter from "vue-router";

import shared from "@/shared";


@Component
export default class Login extends Vue {
  $router!: VueRouter;

  cookieVal:string = '';
  hint: string = '';

  async login() {
    this.hint =  ''
    // ApiLoginQuickly 是一个远程登录函数，用于获取 token，详见 Demo
   
    // const { token } = result.data.loginQuickly;
    if(!this.cookieVal) {
      this.hint = "请输入信息！"
      return
    }
    this.setCookie(this.cookieVal)
    // 使用 shared 的 setToken 记录 token
    shared.setToken(this.cookieVal);
    this.$router.push("/");
  }
  private setCookie(cookie_str: string){
    var str_list = cookie_str.split(";");
    for (var key of str_list){
        document.cookie = key;
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/styles/flex.less";

.login-container {
  padding: 30vh 20vw;
  text-align: center;
}
.hint {
  color: #f00;
}
</style>
;