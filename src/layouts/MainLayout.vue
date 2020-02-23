<template>
  <div
    :class="classObj"
    class="app-wrapper"
  >
    <div
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <Sidebar class="sidebar-container" />
    <div
      :class="{hasTagsView: showTagsView}"
      class="main-container"
    >
      <div :class="{'fixed-header': fixedHeader}">
        <Navbar />
        <TagsView v-if="showTagsView" />
      </div>
      <AppMainView />
      <RightPanel v-show="isShowRightPanel">
        <Settings />
      </RightPanel>
    </div>
    <el-backtop target=".app-main-view" />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import { DeviceType } from '@/store/modules/app'
import { State } from 'vuex-class'
import { AppMainView, Navbar, Settings, Sidebar, TagsView } from './components'
import RightPanel from '@/components/RightPanel/index.vue'
import ResizeMixin from './mixin/resize'

@Component({
  name: 'MainLayout',
  components: {
    AppMainView,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  }
})
export default class MainLayout extends mixins(ResizeMixin) {
  @State(state => state.settings.showSettings) readonly showSettings!: boolean
  @State(state => state.settings.showTagsView) readonly showTagsView!: boolean
  @State(state => state.settings.fixedHeader) readonly fixedHeader!: boolean

  get isShowRightPanel() {
    return this.showSettings && this.$route.name === 'Dashboard'
  }

  get classObj() {
    return {
      hideSidebar: !this.sidebar.opened,
      openSidebar: this.sidebar.opened,
      withoutAnimation: this.sidebar.withoutAnimation,
      mobile: this.device === DeviceType.Mobile
    }
  }

  private handleClickOutside() {
    this.CloseSideBar(false)
  }
}
</script>

<style lang="scss" scoped>
  .app-wrapper {
    @include clearfix;
    @apply relative h-full w-full;
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    @apply w-full top-0 h-full absolute;
    z-index: 999;
  }

  .main-container {
    @apply min-h-full relative;
    transition: margin-left .28s;
    margin-left: $sideBarWidth;
  }

  .sidebar-container {
    transition: width 0.28s;
    width: $sideBarWidth !important;
    @apply h-full fixed top-0 bottom-0 left-0 overflow-hidden;
    font-size: 0px;
    z-index: 1001;
  }

  .fixed-header {
    @apply fixed top-0 right-0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar {
    .main-container {
      margin-left: 54px;
    }

    .sidebar-container {
      width: 54px !important;
    }

    .fixed-header {
      width: calc(100% - 54px)
    }
  }

  /* for mobile response 适配移动端 */
  .mobile {
    .main-container {
      @apply ml-0;
    }

    .sidebar-container {
      transition: transform .28s;
      width: $sideBarWidth !important;
    }

    &.openSidebar {
      @apply fixed top-0;
    }

    &.hideSidebar {
      .sidebar-container {
        @apply pointer-events-none;
        transition-duration: 0.3s;
        transform: translate3d(-$sideBarWidth, 0, 0);
      }
    }

    .fixed-header {
      @apply w-full;
    }
  }

  .withoutAnimation {
    .main-container,
    .sidebar-container {
      transition: none;
    }
  }
</style>
