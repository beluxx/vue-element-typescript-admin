<template>
  <div
    id="tags-view-container"
    class="tags-view-container"
  >
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
    >
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{path: tag.path, query: tag.query, fullPath: tag.fullPath}"
        tag="span"
        class="tags-view-item"
        @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ $t('route.' + tag.meta.title) }}
        <span
          v-if="!isAffix(tag)"
          class="el-icon-close"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <ul
      v-show="visible"
      :style="{left: left+'px', top: top+'px'}"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        {{ $t('tagsView.refresh') }}
      </li>
      <li
        v-if="!isAffix(selectedTag)"
        @click="closeSelectedTag(selectedTag)"
      >
        {{
          $t('tagsView.close') }}
      </li>
      <li @click="closeOthersTags">
        {{ $t('tagsView.closeOthers') }}
      </li>
      <li @click="closeAllTags(selectedTag)">
        {{ $t('tagsView.closeAll') }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { RouteConfig } from 'vue-router'
import { ITagView } from '@/store/modules/tags-view'
import { State, Action } from 'vuex-class'
import ScrollPane from './ScrollPane.vue'

@Component({
  name: 'TagsView',
  components: {
    ScrollPane
  }
})
export default class TagsView extends Vue {
  private visible: boolean = false
  private top: number = 0
  private left: number = 0
  private selectedTag: ITagView = {}
  private affixTags: ITagView[] = []

  @State(state => state.tagsView.visitedViews) readonly visitedViews!: []
  @State(state => state.permission.routes) readonly routes!: []

  @Action('tagsView/addVisitedView') private addVisitedView!: (tag: ITagView) => void
  @Action('tagsView/addView') private addView!: (view: ITagView) => void
  @Action('tagsView/updateVisitedView') private updateVisitedView!: (view: ITagView) => void
  @Action('tagsView/delCachedView') private delCachedView!: (view: ITagView) => void
  @Action('tagsView/delView') private delView!: (view: ITagView) => void
  @Action('tagsView/delOthersViews') private delOthersViews!: (view: ITagView) => void
  @Action('tagsView/delAllViews') private delAllViews!: () => void

  @Watch('$route')
  private onRouteChange() {
    this.addTags()
    this.moveToCurrentTag()
  }

  @Watch('visible')
  private onVisibleChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.closeMenu)
    } else {
      document.body.removeEventListener('click', this.closeMenu)
    }
  }

  mounted() {
    this.initTags()
    this.addTags()
  }

  private isActive(route: ITagView) {
    return route.path === this.$route.path
  }

  private isAffix(tag: ITagView) {
    return tag.meta && tag.meta.affix
  }

  private filterAffixTags(routes: RouteConfig[], basePath = '/') {
    let tags: ITagView[] = []
    routes.forEach(route => {
      if (route.meta && route.meta.affix) {
        const tagPath = path.resolve(basePath, route.path)
        tags.push({
          fullPath: tagPath,
          path: tagPath,
          name: route.name,
          meta: { ...route.meta }
        })
      }
      if (route.children) {
        const childTags = this.filterAffixTags(route.children, route.path)
        if (childTags.length >= 1) {
          tags = [...tags, ...childTags]
        }
      }
    })
    return tags
  }

  private initTags() {
    this.affixTags = this.filterAffixTags(this.routes)
    for (const tag of this.affixTags) {
      // Must have tag name
      if (tag.name && !tag.meta?.hideTag) {
        this.addVisitedView(tag)
      }
    }
  }

  private addTags() {
    const { name, meta } = this.$route
    if (name && !meta.hideTag) {
      this.addView(this.$route)
    }
    return false
  }

  private moveToCurrentTag() {
    const tags: any = this.$refs.tag || [] // TODO: better typescript support for router-link
    this.$nextTick(() => {
      for (const tag of tags) {
        if ((tag.to as ITagView).path === this.$route.path) {
          (this.$refs.scrollPane as ScrollPane).moveToTarget(tag as any)
          // When query is different then update
          if ((tag.to as ITagView).fullPath !== this.$route.fullPath) {
            this.updateVisitedView(this.$route)
          }
          break
        }
      }
    })
  }

  private refreshSelectedTag(view: ITagView) {
    this.delCachedView(view)
    const { fullPath } = view
    this.$nextTick(() => {
      this.$router.replace({
        path: '/redirect' + fullPath
      })
    })
  }

  private closeSelectedTag(view: ITagView) {
    this.delView(view)
    if (this.isActive(view)) {
      this.toLastView(this.visitedViews, view)
    }
  }

  private closeOthersTags() {
    this.$router.push(this.selectedTag)
    this.delOthersViews(this.selectedTag)
    this.moveToCurrentTag()
  }

  private closeAllTags(view: ITagView) {
    this.delAllViews()
    if (this.affixTags.some(tag => tag.path === this.$route.path)) {
      return
    }
    this.toLastView(this.visitedViews, view)
  }

  private toLastView(visitedViews: ITagView[], view: ITagView) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
      this.$router.push(latestView)
    } else {
      // Default redirect to the home page if there is no tags-view, adjust it if you want
      if (view.name === 'Dashboard') {
        // to reload home page
        this.$router.replace({ path: '/redirect' + view.fullPath })
      } else {
        this.$router.push('/')
      }
    }
  }

  private openMenu(tag: ITagView, e: MouseEvent) {
    const menuMinWidth = 105
    const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
    const offsetWidth = (this.$el as HTMLElement).offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const left = e.clientX - offsetLeft + 15 // 15: margin right
    if (left > maxLeft) {
      this.left = maxLeft
    } else {
      this.left = left
    }
    this.top = e.clientY
    this.visible = true
    this.selectedTag = tag
  }

  private closeMenu() {
    this.visible = false
  }
}
</script>

<style lang="scss">
// Reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      @apply text-center;
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:before {
        @apply inline-block;
        transform: scale(0.6);
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}

</style>
<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

  .tags-view-wrapper {
    .tags-view-item {
      @apply inline-block relative cursor-pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          @apply inline-block relative;
          content: '';
          background: #fff;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    @apply m-0 absolute list-none;
    background: #fff;
    z-index: 3000;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);

    li {
      @apply m-0 cursor-pointer;
      padding: 7px 16px;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
