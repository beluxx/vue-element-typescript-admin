<template>
  <div :class="{'has-logo': showLogo}">
    <sidebar-logo
      v-if="showLogo"
      :collapse="isCollapse"
    />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="menuActiveTextColor"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
import SidebarItem from './SidebarItem.vue'
import SidebarLogo from './SidebarLogo.vue'
import variables from '@/styles/_variables.scss'

@Component({
  name: 'SideBar',
  components: {
    SidebarItem,
    SidebarLogo
  }
})
export default class SideBar extends Vue {
  @State(state => state.app.sidebar) readonly sidebar!: any
  @State(state => state.permission.routes) readonly routes!: []
  @State(state => state.settings.showSidebarLogo) readonly showLogo!: boolean
  @State(state => state.settings.sidebarTextTheme ? state.settings.theme : variables.menuActiveText)
  readonly menuActiveTextColor!: string

  get variables() {
    return variables
  }

  get activeMenu() {
    const route = this.$route
    const { meta, path } = route
    // if set path, the sidebar will highlight the path you set
    if (meta.activeMenu) {
      return meta.activeMenu
    }
    return path
  }

  get isCollapse() {
    return !this.sidebar.opened
  }
}
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    @apply overflow-x-hidden;
  }

  .el-scrollbar__view {
    @apply h-full;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      @apply right-0;
    }

    &.is-horizontal {
      @apply hidden;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  @apply h-full;
}

.has-logo {
  .el-scrollbar {
    height: calc(100% - 50px);
  }
}

.el-menu {
  @apply border-none h-full w-full;
  background-color: $menuBg;
}
</style>
