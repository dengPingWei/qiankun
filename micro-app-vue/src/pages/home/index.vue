<template>
  <section style="padding: 20px; color: red;">
     <input type="text" v-model="val">
  </section>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      val: '11'
    }
  }
}
</script>