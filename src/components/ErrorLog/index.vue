<template>
  <div v-if="errorLogs.length>0">
    <el-badge
      :is-dot="true"
      style="line-height: 25px; margin-top: -5px;"
      @click.native="dialogTableVisible=true"
    >
      <el-button
        style="padding: 8px 10px;"
        size="small"
        type="danger"
      >
        <svg-icon name="bug" />
      </el-button>
    </el-badge>

    <el-dialog
      :visible.sync="dialogTableVisible"
      v-el-draggable-dialog
      :modal-append-to-body="true"
      :append-to-body="true"
      width="80%"
    >
      <div slot="title">
        <span style="padding-right: 10px;">Error Log</span>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-delete"
          @click="clearAll"
        >
          Clear All
        </el-button>
      </div>
      <el-table
        :data="errorLogs"
        border
      >
        <el-table-column label="Message">
          <template slot-scope="{row}">
            <div>
              <span class="message-title">Msg:</span>
              <el-tag type="danger">
                {{ row.err.message }}
              </el-tag>
            </div>
            <br>
            <div>
              <span
                class="message-title"
                style="padding-right: 10px;"
              >Info: </span>
              <el-tag type="warning">
                {{ row.vm.$vnode.tag }} error in {{ row.info }}
              </el-tag>
            </div>
            <br>
            <div>
              <span
                class="message-title"
                style="padding-right: 16px;"
              >Url: </span>
              <el-tag type="success">
                {{ row.url }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Stack">
          <template slot-scope="scope">
            {{ scope.row.err.stack }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'

@Component({
  name: 'ErrorLog'
})
export default class ErrorLog extends Vue {
  private dialogTableVisible = false

  @State(state => state.errorLog.logs) readonly errorLogs!: []

  @Action('errorLog/ClearErrorLog') private ClearErrorLog!: () => void

  private clearAll() {
    this.dialogTableVisible = false
    this.ClearErrorLog()
  }
}
</script>

<style lang="scss" scoped>
.message-title {
  @Apply font-bold;
  font-size: 16px;
  color: #333;
  padding-right: 8px;
}
</style>
