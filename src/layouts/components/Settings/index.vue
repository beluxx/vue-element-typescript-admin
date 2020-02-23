<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">
        {{ $t('settings.title') }}
      </h3>

      <div class="drawer-item">
        <span>{{ $t('settings.theme') }}</span>
        <theme-picker
          style="float: right;height: 26px;margin: -3px 8px 0 0;"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.showTagsView') }}</span>
        <el-switch
          v-model="showTagsView"
          class="drawer-switch"
        />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.showSidebarLogo') }}</span>
        <el-switch
          v-model="showSidebarLogo"
          class="drawer-switch"
        />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.fixedHeader') }}</span>
        <el-switch
          v-model="fixedHeader"
          class="drawer-switch"
        />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.sidebarTextTheme') }}</span>
        <el-switch
          v-model="sidebarTextTheme"
          class="drawer-switch"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import ThemePicker from '@/components/ThemePicker/index.vue'

@Component({
  name: 'Settings',
  components: {
    ThemePicker
  }
})
export default class Settings extends Vue {
  @State(state => state.settings.fixedHeader) readonly isFixedHeader!: boolean
  @State(state => state.settings.showTagsView) readonly isShowTagsView!: boolean
  @State(state => state.settings.showSidebarLogo) readonly isShowSidebarLogo!: boolean
  @State(state => state.settings.sidebarTextTheme) readonly isSidebarTextTheme!: boolean

  @Action('settings/ChangeSetting') private ChangeSetting!: (payload: { key: string, value: any}) => void

  get fixedHeader() {
    return this.isFixedHeader
  }

  set fixedHeader(value) {
    this.ChangeSetting({ key: 'fixedHeader', value })
  }

  get showTagsView() {
    return this.isShowTagsView
  }

  set showTagsView(value) {
    this.ChangeSetting({ key: 'showTagsView', value })
  }

  get showSidebarLogo() {
    return this.isShowSidebarLogo
  }

  set showSidebarLogo(value) {
    this.ChangeSetting({ key: 'showSidebarLogo', value })
  }

  get sidebarTextTheme() {
    return this.isSidebarTextTheme
  }

  set sidebarTextTheme(value) {
    this.ChangeSetting({ key: 'sidebarTextTheme', value })
  }

  private themeChange(value: string) {
    this.ChangeSetting({ key: 'theme', value })
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
}
</style>
