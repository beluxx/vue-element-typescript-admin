<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
    />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <header-search class="right-menu-item" />
        <error-log class="errLog-container right-menu-item hover-effect" />
        <screenfull class="right-menu-item hover-effect" />
        <el-tooltip
          :content="$t('navbar.size')"
          effect="dark"
          placement="bottom"
        >
          <size-select class="right-menu-item hover-effect" />
        </el-tooltip>
        <lang-select class="right-menu-item hover-effect" />
      </template>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img
            :src="avatar"
            class="user-avatar"
            alt="user"
          >
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/profile/">
            <el-dropdown-item>
              {{ $t('navbar.profile') }}
            </el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              {{ $t('navbar.dashboard') }}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span
              style="display:block;"
              @click="handleUserLogout"
            >{{ $t('navbar.logOut') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import to from 'await-to-js'
import Screenfull from '@/components/Screenfull/index.vue'
import LangSelect from '@/components/LangSelect/index.vue'
import SizeSelect from '@/components/SizeSelect/index.vue'
import HeaderSearch from '@/components/HeaderSearch/index.vue'
import Hamburger from '@/components/Hamburger/index.vue'
import Breadcrumb from '@/components/Breadcrumb/index.vue'
import ErrorLog from '@/components/ErrorLog/index.vue'

@Component({
  name: 'Navbar',
  components: {
    Breadcrumb,
    Hamburger,
    HeaderSearch,
    LangSelect,
    Screenfull,
    SizeSelect,
    ErrorLog
  }
})
export default class Navbar extends Vue {
  @State(state => state.app.sidebar) readonly sidebar!: object
  @State(state => state.app.device.toString()) readonly device!: string
  @State(state => state.user.avatar) readonly avatar!: string

  @Action('app/ToggleSideBar') private ToggleSideBar!: (withoutAnimation: boolean) => void
  @Action('user/UserLogout') private UserLogout!: () => Promise<any>

  private toggleSideBar() {
    this.ToggleSideBar(false)
  }

  /**
   * 退出登录
   */
  private async handleUserLogout() {
    const [failed] = await to(this.UserLogout())
    if (failed) {
      return
    }
    this.$router.push(`/account/login?redirect=${this.$route.fullPath}`)
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  @apply overflow-hidden relative bg-white;
  height: 50px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    @apply h-full float-left cursor-pointer;
    line-height: 46px;
    padding: 0 15px;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    @apply float-left;
  }

  .errLog-container {
    @apply inline-block align-top;
  }

  .right-menu {
    @apply float-right h-full;
    line-height: 50px;

    &:focus {
      @apply outline-none;
    }

    .right-menu-item {
      @apply inline-block h-full align-text-bottom;
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;

      &.hover-effect {
        @apply cursor-pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        @apply relative flex items-center;

        .user-avatar {
          @apply cursor-pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          @apply cursor-pointer absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
