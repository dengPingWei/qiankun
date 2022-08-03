<template>
  <section class="home-container">
    <input type="text" v-model="val">
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {
  val: string | undefined = "";
}
</script>

<style lang="less" scoped>
.home-container {
  padding: 30px;
}
</style>
