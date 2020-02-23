<template>
  <section class="app-main-view">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view />
      </keep-alive>
    </transition>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
@Component({
  name: 'AppMainView'
})
export default class AppMainView extends Vue {
  @State(state => state.tagsView.cachedViews) readonly cachedViews!: string[]
}
</script>

<style lang="scss" scoped>
.app-main-view {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  height: calc(100vh - 84px);
  @apply w-full relative overflow-hidden;
}

.fixed-header+.app-main-view {
  padding-top: 50px;
  @apply h-screen overflow-auto;
}

.hasTagsView {
  .app-main-view {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main-view {
    padding-top: 84px;
  }
}
</style>
