<template>
  <el-dropdown
    trigger="click"
    class="international"
    @command="handleSetLanguage"
  >
    <div>
      <svg-icon
        name="language"
        class="international-icon"
      />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        :disabled="language==='zh'"
        command="zh"
      >
        中文
      </el-dropdown-item>
      <el-dropdown-item
        :disabled="language==='en'"
        command="en"
      >
        English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

@Component({
  name: 'LangSelect'
})
export default class LangSelect extends Vue {
  @State(state => state.app.language) readonly language!: string

  @Action('app/SetLanguage') private SetLanguage!: (lang: string) => void

  private handleSetLanguage(lang: string) {
    this.$i18n.locale = lang
    this.SetLanguage(lang)
    this.$message({
      message: 'Switch Language Success',
      type: 'success'
    })
  }
}
</script>
