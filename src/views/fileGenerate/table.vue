/*
    自定义表格
    author: weilq
    date: 2019/8/30
 */
<template>
  <div class="my-table">
    <el-table ref="myTable"
              :data="data"
              style="width: 100%;"
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              :height="tableHeight"
              :border="true"
              :fit="true">
      <el-table-column fixed
                       type="index"
                       width="50"
                       label="序号"
                       align="center"></el-table-column>
      <el-table-column prop="field_convert_map.msgId"
                       label="来源"
                       align="center"></el-table-column>
      <el-table-column prop="fileName"
                       label="文件名"
                       align="center"></el-table-column>
      <el-table-column prop="field_convert_map.printSize"
                       label="文件大小"
                       align="center"></el-table-column>
      <el-table-column prop="field_convert_map.status"
                       label="状态"
                       align="center">
        <template slot-scope="scope">
          <el-tooltip class="item"
                      effect="light"
                      :disabled="scope.row.field_convert_map.status !== '错误'"
                      :content="scope.row.errorInfo"
                      placement="top">
            <span>{{ scope.row.field_convert_map.status }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="execRate"
                       label="处理进度"
                       align="center">
        <template slot-scope="scope">
          <el-progress :percentage="scope.row.execRate"></el-progress>
        </template>
      </el-table-column>
      <el-table-column prop="addTime"
                       label="添加时间"
                       align="center"></el-table-column>
      <el-table-column label="操作"
                       width="120"
                       fixed="right"
                       align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.field_convert_map.status === '已完成'"
                     type="primary"
                     plain
                     size="mini"
                     @click="download(scope.row)">
            下载
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="pagenation"
         class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageNo"
                     :page-sizes="[10,20,30,50]"
                     :page-size="pageSize"
                     :total="total"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { baseRequest } from '@/api/base'
import { download } from '@/utils/download'
const url = '/basic/t00CreateFile/selects'
export default {
  props: {
    searchToggle: Boolean // 筛选折叠
  },
  data() {
    return {
      pagenation: true, // 启用分页
      data: [], // table 数据
      formHeight: 52,
      listLoading: false, // 加载
      tableParams: {}, // 查询参数
      total: null, // 总数
      pageNo: 1, // 当前页
      pageSize: 10, // 页大小
      options: null // 请求参数
    }
  },
  components: {
  },
  computed: {
    tableConfig: function() { // table element属性
      return this.tableOption.tableConfig
    },
    formConfig: function() {
      return this.tableOption.formConfig
    },
    tableHeight: function() {
      this.formHeight = this.getFormHeight()
      return this.getTableHeight()
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(_ => {
      this.formHeight = this.getFormHeight()
    })
    this.getData({})
  },
  watch: {
    searchToggle() {
      this.formHeight = this.getFormHeight()
    }
  },
  methods: {
    setOptions(option) {
      this.options = option
      this.getData()
    },
    clearOptions() {
      this.options = null
      this.pageNo = 1
      this.getData()
    },
    getData() { // 获取列表
      let param = {}
      if (this.options) {
        param = { ...param, ...this.options }
      }
      param.pageNo = this.pageNo
      param.pageSize = this.pageSize
      baseRequest(url, param).then(response => {
        const result = response.data
        this.data = result.item // 表格数据
        this.total = result.total
        this.pageNo = result.pageNo
        this.pageSize = result.pageSize
      })
    },
    getTableHeight() {
      const pageHeight = this.pagenation ? 130 : 100
      return this.$store.state.app.containHeight - this.formHeight - pageHeight
    },
    getFormHeight() {
      const formDom = document.querySelector('.form-search')
      return formDom ? formDom.offsetHeight + 52 : 0
    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.getData()
    },
    // 下载
    download(row) {
      this.loading = true
      const param = { fileId: row.fileId }
      download('/basic/files/download', param, () => {
        this.loading = false
      }, () => {
        this.loading = false
      })
    }
  }
}
</script>

