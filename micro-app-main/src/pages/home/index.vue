<template>
<div>
  <div class="card">
    <span :class="{ 'active': activeKey=='1'}" @click="onClick('1')">11111</span>
    <span :class="{ 'active': activeKey=='2'}" @click="onClick('2')">2222</span>
    <span :class="{ 'active': activeKey=='3'}" @click="onClick('3')">33333</span>
  </div>
  <div>
    <div v-show="activeKey=='1'">
      111111111
      <input type="text" v-model="val1">
    </div>
    <div v-show="activeKey=='2'">
      22222
      <input type="text" v-model="val2">
    </div>
    <div v-show="activeKey=='3'">
      33333
      <input type="text" v-model="val3">
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  val1: string | undefined = "1";
  val2: string | undefined = "2";
  val3: string | undefined = "3";
  activeKey: string | undefined ='1';
  private onClick (index: string) {
    this.activeKey = index
  }
}
</script>

<style lang="less" scoped>
.card {
  span {
    display: inline-block;
    margin: 0 10px;
    border: 1px solid #f00;
  }
}
.home-container {
  padding: 30px;
}
</style>
