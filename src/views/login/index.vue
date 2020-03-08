<template>
  <div class="login-container">
    <div class="flex justify-center items-center h-full px-6">
      <div class="w-full xl:w-3/4 lg:w-11/12 flex">
        <div
          class="login-bg w-full h-auto bg-white hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
        />
        <div class="w-full lg:w-1/2 p-5 rounded-lg lg:rounded-l-none">
          <h3 class="pt-4 text-2xl text-center">{{ $t('login.title') }}</h3>
          <el-form
            ref="dataForm"
            @submit.native.prevent
            :model="loginForm"
            :rules="loginRules"
            autocomplete="on"
            label-position="left"
            class="login-form px-8 pt-6 pb-8 mb-4 rounded relative"
          >
            <lang-select class="set-language" />
            <el-form-item prop="username">
              <el-input
                ref="username"
                v-model="loginForm.username"
                :placeholder="$t('login.username')"
                name="username"
                type="text"
                autocomplete="on"
                prefix-icon="el-icon-user-solid"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                :placeholder="$t('login.password')"
                name="password"
                autocomplete="on"
                prefix-icon="el-icon-lock"
                @keyup.enter.native="handleUserLogin"
              />
              <span
                class="show-pwd"
                @click="showPwd"
              >
                <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'" />
              </span>
            </el-form-item>

            <div class="mb-6 text-center">
              <el-button
                :loading="loading"
                type="primary"
                style="width:100%; margin-bottom:30px;"
                @click.native.prevent="handleUserLogin"
              >
                {{ $t('login.logIn') }}
              </el-button>
            </div>
            <hr class="mb-6 border-t">
            <div class="text-center">
              <router-link
                to="/account/register"
                class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
              >
                Create an Account!
              </router-link>
            </div>
            <div class="text-center">
              <router-link
                to="/account/forget"
                class="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
              >
                Forgot Password?
              </router-link>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Ref } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form, Input } from 'element-ui'
import LangSelect from '@/components/LangSelect/index.vue'
import { Action } from 'vuex-class'
import to from 'await-to-js'
import { ILoginParams } from '@/api/types'
import formRules from './validator'

@Component({
  name: 'Login',
  components: {
    LangSelect
  }
})
export default class Login extends Vue {
  private loginForm = {
    username: '',
    password: ''
  }
  /**
   * 表单验证规则
   */
  private loginRules = formRules
  private passwordType = 'password'
  private loading = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}

  @Ref('dataForm') readonly dataFormElement!: Form
  @Ref('username') readonly usernameInputElement!: Input
  @Ref('password') readonly passwordInputElement!: Input

  @Action('user/UserLogin') private UserLogin!: (params: ILoginParams) => Promise<any>

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  mounted() {
    if (this.loginForm.username === '') {
      this.usernameInputElement.focus()
    } else if (this.loginForm.password === '') {
      this.passwordInputElement.focus()
    }
  }

  /**
   * 密码显示/隐藏切换
   */
  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      this.passwordInputElement.focus()
    })
  }

  private handleUserLogin() {
    this.dataFormElement.validate(async valid => {
      if (!valid) {
        return
      }
      const [failed] = await to(this.UserLogin(this.loginForm))
      if (failed) {
        return
      }
      this.$router.push({
        path: this.redirect || '/',
        query: this.otherQuery
      })
    })
  }

  /**
   * 获取url query参数
   * @param query
   * @return {...query}
   */
  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    @apply mx-auto h-full;
    background-color: #F6F6F6;
    .login-bg {
      background-image: url('~@/assets/login-images/bg.jpg');
    }
    .login-form {
      @apply relative overflow-hidden max-w-full my-0 mx-auto;
      width: 520px;
      padding: 160px 35px 0;
    }

    .set-language {
      @apply absolute cursor-pointer;
      color: $darkGray;
      top: -4px;
      font-size: 18px;
      right: 36px;
    }
    .show-pwd {
      @apply absolute top-0 cursor-pointer select-none;
      right: 10px;
      font-size: 16px;
      color: $darkGray;
    }
  }
</style>
