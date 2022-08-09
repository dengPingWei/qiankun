<template>
    <a-sub-menu :key="menuInfo.key">
    {{ menuInfo.title }}
        <!-- <template #title>{{ menuInfo.title }}</template> -->
        <!-- <template v-for="item in menuInfo.children">
        <template v-if="!item.children">
            <a-menu-item :key="item.key">
            {{ item.title }}
            </a-menu-item>
        </template>
        <template v-else>
            <sub-menu :menu-info="item" :key="item.key" />
        </template>
        </template> -->
    </a-sub-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop, } from "vue-property-decorator";

type MenuItem = {
  key: string;
  title: string;
  icon?: string;
  path: string;
  isMicro?: boolean;
  children?: MenuItem[];
};

@Component
export default class Menu extends Vue {
  @Prop({ type: Object, default: {} })
  menuInfo!: MenuItem;

  selectKey: string = "";
  openKeys: any = [];
  created() {}
}
</script>

<style lang="less" scoped>
</style>