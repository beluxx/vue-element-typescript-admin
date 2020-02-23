<template>
  <div
    v-if="!item.meta || !item.meta.hidden"
    :class="['menu-wrapper', isCollapse ? 'simple-mode' : 'full-mode', {'first-level': isFirstLevel}, {'hidden-drop-icon': isHiddenDropIcon}]"
    @click.stop="redirectTo(item)"
  >
    <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
      <sidebar-item-link
        v-if="theOnlyOneChild.meta"
        :to="resolvePath(theOnlyOneChild.path)"
      >
        <el-menu-item
          :index="resolvePath(theOnlyOneChild.path)"
          :class="{'submenu-title-noDropdown': isFirstLevel}"
        >
          <svg-icon
            v-if="theOnlyOneChild.meta.icon"
            :name="theOnlyOneChild.meta.icon"
          />
          <span
            v-if="theOnlyOneChild.meta.title"
            slot="title"
          >{{ $t('route.' + theOnlyOneChild.meta.title) }}</span>
        </el-menu-item>
      </sidebar-item-link>
    </template>
    <el-submenu
      v-else
      :index="resolvePath(item.path)"
      popper-append-to-body
      :class="{'menu-is-active': $route.name === item.name, 'menu-is-sub-active': isSubActive}"
    >
      <template slot="title">
        <svg-icon
          v-if="item.meta && item.meta.icon"
          :name="item.meta.icon"
        />
        <span
          v-if="item.meta && item.meta.title"
          slot="title"
        >{{ $t('route.' + item.meta.title) }}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-submenu>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { isExternal } from '@/utils/validate'
import SidebarItemLink from './SidebarItemLink.vue'
import { State } from 'vuex-class'
import { IRouteConfig } from '@/router'
import { ITagView } from '@/store/modules/tags-view'

@Component({
  // Set 'name' here to prevent uglifyjs from causing recursive component not work
  // See https://medium.com/haiiro-io/element-component-name-with-vue-class-component-f3b435656561 for detail
  name: 'SidebarItem',
  components: {
    SidebarItemLink
  }
})
export default class SidebarItem extends Vue {
  @Prop({ required: true }) private item!: RouteConfig
  @Prop({ default: false }) private isCollapse!: boolean
  @Prop({ default: true }) private isFirstLevel!: boolean
  @Prop({ default: '' }) private basePath!: string

  @State(state => state.tagsView.cachedViews) readonly cachedViews!: (string | undefined)[]
  @State(state => state.tagsView.visitedViews) readonly visitedViews!: ITagView[]

  get alwaysShowRootMenu() {
    if (this.item.meta && this.item.meta.alwaysShow) {
      return true
    }
    return false
  }

  get showingChildNumber() {
    if (this.item.children) {
      const showingChildren = this.item.children.filter((item) => {
        return !(item.meta && item.meta.hidden)
      })
      return showingChildren.length
    }
    return 0
  }

  get theOnlyOneChild() {
    if (this.showingChildNumber > 1) {
      return null
    }
    if (this.item.children) {
      for (const child of this.item.children) {
        if (!child.meta || !child.meta.hidden) {
          return child
        }
      }
    }
    // If there is no children, return itself with path removed,
    // because this.basePath already conatins item's path information
    return { ...this.item, path: '' }
  }

  get isHiddenDropIcon() {
    return this.theOnlyOneChild && !this.theOnlyOneChild.path && this.theOnlyOneChild.children?.every(child => child.meta.hidden)
  }

  get isSubActive() {
    return this.isHiddenDropIcon && this.theOnlyOneChild?.children?.map(child => child.name).includes(this.$route.name)
  }

  private resolvePath(routePath: string) {
    if (isExternal(routePath)) {
      return routePath
    }
    if (isExternal(this.basePath)) {
      return this.basePath
    }
    return path.resolve(this.basePath, routePath)
  }

  private getChildrenTitle(item: IRouteConfig) {
    const showChildren = item.children?.filter(child => child.meta && !child.meta.hidden) ?? []
    if (showChildren.some(child => !child.children)) {
      return item.children?.filter(child => child.meta && !child.meta.hidden).map(child => child.meta.title) ?? []
    }
    const childrenTitle: any[] = []
    showChildren.forEach(child => {
      childrenTitle.push(...this.getChildrenTitle(child))
    })
    return childrenTitle
  }

  private redirectTo(item: IRouteConfig) {
    const childrenTitleArr = this.getChildrenTitle(item)
    if (this.visitedViews.some(visitedItem => childrenTitleArr.includes(visitedItem.title))) {
      return
    }
    if (item.meta?.noRedirect) {
      return
    }
    this.$router.push({ name: item.name })
  }
}
</script>

<style lang="scss">
.el-submenu.is-active > .el-submenu__title {
  color: $subMenuActiveText !important;
}

.full-mode, .simple-mode {
  .el-submenu > .el-submenu__title,
  .el-menu-item {
    min-width: $sideBarWidth !important;
    background-color: $subMenuBg !important;
    color: $menuText;

    &:hover {
      background-color: $subMenuHover !important;
    }
  }
}
.hidden-drop-icon {
  .el-submenu__icon-arrow {
    display: none;
  }
}
.menu-is-active {
  .el-submenu__title > span {
    color: $menuActiveText !important;
  }
}
.menu-is-sub-active {
  .el-submenu__title > span {
    color: $subMenuActiveText !important;
  }
}

.simple-mode {
  &.first-level {
    .submenu-title-noDropdown {
      @apply p-0 relative #{!important};

      .el-tooltip {
        @apply p-0 #{!important};
      }
    }

    .el-submenu {
      @apply overflow-hidden;

      &>.el-submenu__title {
        @apply p-0 #{!important};

        .el-submenu__icon-arrow {
          @apply hidden;
        }

        &>span {
          @apply invisible;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.svg-icon {
  margin-right: 16px;
}

.simple-mode {
  .svg-icon {
    margin-left: 20px;
  }
}
</style>
