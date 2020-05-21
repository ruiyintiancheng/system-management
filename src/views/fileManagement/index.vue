<template>
  <div class="app-container"
       v-loading="loading">
    <div class="base-row">
      <div class="row-botton clearfix">
        <div class="row-title">
          <svg-icon icon-class="search" />
          <span>筛选查询</span>
        </div>
        <div class="row-option">
          <el-button icon="el-icon-search"
                     @click="searchOption"
                     type="primary">查询</el-button>
          <el-button icon="el-icon-refresh"
                     @click="getOption">重置</el-button>
          <a @click="searchToggle=false"
             v-if="searchToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="searchToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <search-form v-show="searchToggle"
                   ref="searchForm"
                   :searchFormData="configData"></search-form>
    </div>
    <div class="base-row">
      <div class="row-botton clearfix">
        <div class="row-title">
          <svg-icon icon-class="ul" />
          <span>数据列表</span>
        </div>
        <div class="row-option">
          <a @click="tableToggle=false"
             v-if="tableToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="tableToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <basic-table v-show="tableToggle"
                   ref="basicTable"
                   :tableOption="configData"
                   :pagenation="true"
                   :rowNum="true">
        <el-table-column slot="optionColumn"
                         label="操作"
                         align="center"
                         :width="200"
                         fixed="right">
          <template slot-scope="scope">
            <el-button v-if="scope"
                       type="primary"
                       plain
                       size="mini"
                       @click="download(scope.row)">下载</el-button>
            <el-button type="danger"
                       plain
                       size="mini"
                       @click="downloadLog(scope.row)">下载记录</el-button>
          </template>
        </el-table-column>
      </basic-table>
    </div>
    <file-downLog ref="fileDownloadLog"></file-downLog>
  </div>
</template>
<script>
import { download } from '@/utils/download'
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import { getSearchParam } from '@/utils/index'
import { baseRequest } from '@/api/base'
import fileDownLog from './fileDownloadLog'
const url = '/basic/files/getT00FileList'
export default {
  name: 'fileManagementIndex',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm,
    fileDownLog
  },
  data() {
    return {
      loading: false,
      configData: {}, // 模板数据
      searchToggle: true,
      tableToggle: true,
      updateFormData: null, // 弹框数据
      formVisible: false, // 弹框开关
      operateStatus: null, // 操作选项
      paramId: null, // 修改保存参数id
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改'
      }
    }
  },
  created() {
    this.getOption()
  },
  methods: {
    searchOption() {
      this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
    },
    getOption() {
      baseRequest(url, { urlMode: '1' }).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        result.tableConfig = JSON.parse(result.tableConfig)
        this.configData = result
        const param = getSearchParam(result.formConfig)
        this.$refs.basicTable.getData(url, param)
      })
    },
    // 下载
    download(row) {
      this.loading = true
      const param = { fileId: row.file_id }
      download('/basic/files/download', param, () => {
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    downloadLog(row) {
      this.$refs.fileDownloadLog.openDialog(row)
    }
  }
}
</script>

