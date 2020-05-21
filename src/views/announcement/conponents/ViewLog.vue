/*
 * @Author: lk 
 * @Date: 2019-02-21 14:55:05 
 * @Last Modified by: lk
 * @Last Modified time: 2019-03-01 11:38:28
 * @Description:  公告管理-查看记录
 */
<template>
  <div class="app-container">
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
                   :inputCount="3"
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
                   :height="tableHeight"
                   :tableOption="configData"
                   :pagenation="true"
                   :rowNum="true"
                   :rowCheck="false">
      </basic-table>
    </div>

  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import { baseRequest } from '@/api/base'
const url = '/basic/notices/viewLog'
export default {
  components: {
    SearchForm,
    BasicTable
  },
  props: {
    viewLog: Object
  },
  data() {
    return {
      configData: {}, // 模板数据
      searchToggle: true,
      tableToggle: true,
      tableHeight: 0
    }
  },
  created() {
    this.getOption()
  },
  methods: {
    searchOption() {
      const param = this.$refs.searchForm.searchParam()
      param.noticeId = this.viewLog.noticeId
      param.publishType = this.viewLog.publishType
      this.$refs.basicTable.getData(url, param)
    },
    getOption() {
      baseRequest(url, { 'urlMode': '1' }).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        result.tableConfig = JSON.parse(result.tableConfig)
        this.configData = result
        this.$nextTick(function() {
          this.tableHeight = document.querySelector('.dialog-contant-default.notice').offsetHeight - 241
          this.searchOption()
        })
      })
    }
  }
}
</script>

