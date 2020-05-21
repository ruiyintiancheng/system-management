/*
    文件生成
    author: weilq
    date: 2019/8/29
 */
<template>
    <div class="app-container" v-loading="loading">
        <div class="base-row">
          <div class="row-botton clearfix">
            <div class="row-title">
              <svg-icon icon-class="search" />
              <span>筛选查询</span>
            </div>
            <div class="row-option">
              <el-button icon="el-icon-search" @click="searchOption" type="primary">查询</el-button>
              <el-button icon="el-icon-refresh" @click="getOption" >重置</el-button>
              <a @click="searchToggle=false" v-if="searchToggle"><svg-icon icon-class="up" />&nbsp;收起</a>
              <a  @click="searchToggle=true" v-else><svg-icon icon-class="down"/>&nbsp;展开</a>
            </div>
          </div>
          <div v-show="searchToggle">
            <div class="form-search">
              <el-form :inline="true" :model="serachForm" class="demo-table-expand">
                <div class="input-both-3">
                  <el-form-item>
                    <span class="input-label">文件名</span>
                    <el-input style="width:250px" v-model="serachForm.fileName" clearable></el-input>
                  </el-form-item>
                </div>
                <div class="input-both-3">
                  <el-form-item>
                    <span class="input-label">处理状态</span>
                    <el-select v-model="serachForm.status" clearable placeholder="">
                      <el-option :label="'已完成'" :value="2"></el-option>
                      <el-option :label="'处理中'" :value="1"></el-option>
                      <el-option :label="'错误'" :value="0"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
        </div>
        <div class="base-row">
            <div class="row-botton clearfix">
              <div class="row-title">
                <svg-icon icon-class="ul" />
                <span>数据列表</span>
              </div>
               <div class="row-option">
                <a @click="tableToggle=false" v-if="tableToggle"><svg-icon icon-class="up" />&nbsp;收起</a>
                <a  @click="tableToggle=true" v-else><svg-icon icon-class="down"/>&nbsp;展开</a>
               </div>
            </div>
            <my-table v-show="tableToggle" ref="myTable" :searchToggle="searchToggle">
            </my-table>
        </div>
    </div>
</template>
<script>
import myTable from './table'
import UpdateForm from 'update-form-ry'
export default {
  name: 'fileManagementIndex',
  components: {
    myTable,
    UpdateForm
  },
  data() {
    return {
      serachForm: {
        fileName: '',
        status: null
      },
      loading: false,
      searchToggle: true,
      tableToggle: true
    }
  },
  created() {
    // this.getOption()
  },
  methods: {
    searchOption() { // 查询
      this.$refs.myTable.setOptions(this.serachForm)
    },
    getOption() {
      this.serachForm.fileName = ''
      this.serachForm.staus = ''
      this.$refs.myTable.clearOptions()
    }
  }
}
</script>

