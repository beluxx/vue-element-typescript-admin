<template>
  <div class="dashboard">
    <h1 class="dashboard-title">首页</h1>
    <p class="dashboard-body">
      测试文本
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Dashboard'
})
export default class Dashboard extends Vue {
}
</script>

<style lang="scss" scoped>
  .dashboard {
    @apply h-full w-full p-4;
    &-title {
      @apply text-4xl;
    }
    &-body {
      @apply pl-6 text-2xl text-blue-500;
    }
  }
</style>
