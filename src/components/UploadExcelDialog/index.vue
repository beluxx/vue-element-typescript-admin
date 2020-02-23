<template>
  <el-dialog
    v-el-draggable-dialog
    :modal-append-to-body="true"
    :append-to-body="true"
    :title="title"
    :visible.sync="uploadVisible"
    width="800px"
    custom-class="edit-dialog"
  >
    <div class="app-container">
      <UploadExcel
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
      />
      <div class="preview-title">预览:</div>
      <el-table
        :data="tableData"
        :height="tableHeight"
        border
        highlight-current-row
        style="width: 100%;margin-top:20px;"
      >
        <el-table-column
          v-for="item of tableHeader"
          :key="item"
          :prop="item"
          :label="item"
        />
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="uploadVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpload">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Emit, Vue } from 'vue-property-decorator'
import UploadExcel from '@/components/UploadExcel/index.vue'
import { State } from 'vuex-class'

@Component({
  name: 'UploadExcelDialog',
  components: {
    UploadExcel
  }
})
export default class UploadExcelDialog extends Vue {
  private uploadVisible = false
  private title = ''
  private tableData: any = []
  private tableHeader: string[] = []
  private excelFile: any

  @State(state => state.app.documentClientHeight - 620) tableHeight!: number

  @Emit('uploadTableData')
  uploadTableData({ tableData, tableHeader, excelFile }: any = {}) {
  }

  private beforeUpload(file: File) {
    const isLt1M = file.size / 1024 / 1024 < 1
    if (isLt1M) {
      this.excelFile = file
      console.log('file', file)
      return true
    }
    this.$message({
      message: '上传的文件大小不能超过1M',
      type: 'error'
    })
    return false
  }

  private handleSuccess({ results, header }: { results: any, header: string[]}) {
    this.tableData = results
    this.tableHeader = header
  }

  private initDialog({ title = '上传' }) {
    this.uploadVisible = true
    this.$nextTick(() => {
      this.title = title
      this.tableHeader = []
      this.tableData = []
      this.excelFile = null
    })
  }

  private handleUpload() {
    if (!this.excelFile) {
      this.$message({
        message: '请上传文件',
        type: 'error'
      })
      return
    }
    this.uploadTableData({
      tableData: this.tableData,
      tableHeader: this.tableHeader,
      excelFile: this.excelFile
    })
    this.uploadVisible = false
  }
}
</script>
