<template>
  <section class="footer">
    <div class="page-info">
      <span class="index_account" v-show="pageInfo.zhangSet">账套: {{ pageInfo.zhangSet }}</span>
      <span v-show="pageInfo.time">登录日期: {{ pageInfo.time }}</span>
    </div>
    <div class="copy">
      {{ pageInfo.copy || '望海康信（北京）科技股份公司版权所有©2020' }}
    </div>
    
  </section>
</template>

<script lang="ts">
import { Component, Vue,Prop } from "vue-property-decorator";
type Item = {
  time?: string;
  copy?: string;
  zhangSet?: string
};

@Component({
  components: {
    Footer
  }
})
export default class Footer extends Vue {
  @Prop({ type: Object, default: () => { return {
    time: '',
    copy: '望海康信（北京）科技股份公司版权所有©202s0',
    zhangSet: ''
  }}})
  pageInfo: Item;
}
</script>

<style lang="less" scoped>
.footer {
  // display: flex;
  // display: -ms-flexbox;
  position: relative;
  padding-left: 16px;
  padding-right: 16px;
  width: 100%;
  height: 100%;
  background: #eaeff3;
  text-align: center;
  font-size: 14px;
  .page-info {
    position: absolute;
  }
  .index_account {
    margin-right: 24px;
  }
}
</style>