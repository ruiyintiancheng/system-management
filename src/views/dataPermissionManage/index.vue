/*
 * @Author: M.HQ 
 * @Date: 2019-02-28 11:19:14 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-09-27 17:05:24
 * @Description: 数据权限配置
 */
<template>
  <div class="app-container">
    <el-row class="tree-box">
      <!-- 树开始 -->
      <el-col :span="4"
              class="code-tree">
        <div class="row-botton clearfix">
          <div class="row-title">
            <svg-icon icon-class="tree" />
            <span>数据列表</span>
          </div>
        </div>
        <el-tree class="tree-list"
                 :data="treeData"
                 default-expand-all
                 ref="tree"
                 highlight-current
                 :expand-on-click-node="false"
                 :props="defaultProps"
                 @node-click="handleNodeClick">
        </el-tree>
      </el-col>
      <!-- 树结束 -->
      <!-- 表格开始 -->
      <el-col :span="20">
        <!-- 查询区域开始 -->
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
        <!-- 查询区域结束 -->
        <!-- 表格数据开始 -->
        <div class="base-row">
          <div class="row-botton clearfix">
            <div class="row-title">
              <svg-icon icon-class="ul" />
              <span>数据列表</span>
            </div>
            <div class="row-option">
              <el-button icon="el-icon-plus"
                         @click="addOption">添加</el-button>
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
                             width="300"
                             fixed="right">
              <template slot-scope="scope">
                <el-button type="primary"
                           plain
                           size="mini"
                           @click="updateOption(scope.row)">修改</el-button>
                <el-button type="danger"
                           plain
                           size="mini"
                           @click="handleDelete(scope.row)">删除</el-button>
                <el-button type="info"
                           plain
                           size="mini"
                           @click="addChildren(scope.row)">添加下级</el-button>
              </template>
            </el-table-column>
          </basic-table>
        </div>
        <!-- 表格数据结束 -->
      </el-col>
      <!-- 表格结束 -->
    </el-row>
    <el-dialog :title="dialogTitle[operateStatus]"
               :visible.sync="formVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default">
        <update-form ref="updateFrom"
                     :updateFormData="updateFormData"></update-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import { baseRequest } from '@/api/base'
const url = '/basic/entitys/getDataList'
export default {
  name: 'dataPermissionManageIndex',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm
  },
  data() {
    return {
      treeData: [], // 树数据
      defaultProps: { // 树对应关系
        children: 'children',
        label: 'name'
      },
      configData: {}, // 表格数据
      updateFormData: null, // 弹框数据
      formVisible: false, // 弹框开关
      searchToggle: true, // 查询下拉切换
      tableToggle: true, // 表格下拉切换
      treeId: '0', // 左侧树id,
      operateStatus: null,
      parentEntityCode: null, // 添加下级和修改保存参数id
      entityType: null,
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '添加下级',
        3: '修改'
      }
    }
  },
  created() {
    this.getTree(true)
  },
  mounted() {
  },
  methods: {
    // 点击查询
    searchOption() {
      const param = this.$refs.searchForm.searchParam()
      param.parentEntityCode = this.treeId
      param.entityType = this.entityType
      param.paramConvertMap = {
        entityCode_start: '90',
        entityCode_end: '2000'
      }
      param.orderBySection = 'DISP_ORDER'
      this.$refs.basicTable.getData(url, param)
    },
    // 初始化数据
    getOption() {
      const param = { urlMode: '1', parentDictId: '1' }
      baseRequest(url, param).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        result.tableConfig = JSON.parse(result.tableConfig)
        this.configData = result
        this.$nextTick(() => {
          this.searchOption()
        })
      })
    },
    // 获取树数据
    getTree(flag) {
      baseRequest('/basic/entitys/getDataTree').then(response => {
        this.treeData = response.data.item
        if (flag) {
          this.treeId = this.treeData[0].id
          this.entityType = this.treeData[0].entityType
          this.$nextTick(() => {
            this.getOption()
          })
        }
      })
    },
    // 点击树切换数据
    handleNodeClick(data) {
      this.treeId = data.id
      this.entityType = data.entityType
      this.$refs.searchForm.resetForm()
      this.searchOption()
    },
    // 点击添加
    addOption() {
      this.operateStatus = 1
      this.parentEntityCode = this.treeId
      this.getAddForm()
    },
    // 点击添加下级
    addChildren(row) {
      this.operateStatus = 2
      this.parentEntityCode = row.entityCode
      this.getAddForm()
    },
    // 修改表单
    updateOption(row) {
      this.operateStatus = 3
      this.parentEntityCode = null
      this.getForm(row)
    },
    // 获取表单
    getForm(row) {
      const param = { entityType: row ? row.entityType : null, entityCode: row ? row.entityCode : null }
      baseRequest('/basic/entitys/select', param).then(response => {
        // response.data.item = {}
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        // result.validator = JSON.parse(result.validator)
        this.updateFormData = result
        this.formVisible = true
        this.$nextTick(function() {
          this.$refs.updateFrom.clearValidate()
        })
      })
    },
    getAddForm() {
      baseRequest('/basic/entitys/getAddData').then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        this.updateFormData = result
        this.formVisible = true
        this.$nextTick(function() {
          this.$refs.updateFrom.clearValidate()
        })
      })
    },
    // 保存操作
    saveOperate() {
      const param = this.$refs.updateFrom.getFormData()
      param.entityType = this.entityType
      param.parentEntityCode = this.parentEntityCode

      if (this.operateStatus !== 3) {
        this.$refs.updateFrom.saveRequest('/entitys/add', param).then(response => {
          this.getTree()
          this.searchOption()
          this.$Message.success('操作成功')
          this.formVisible = false
        })
      } else {
        this.$refs.updateFrom.saveRequest('/entitys/update', param).then(response => {
          this.getTree()
          this.searchOption()
          this.$Message.success('操作成功')
          this.formVisible = false
        })
      }
    },
    handleDelete(row) {
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          entityType: row.entityType,
          entityCode: row.entityCode
        }
        baseRequest('/basic/entitys/delete', param).then(request => {
          this.searchOption()
          this.getTree()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tree-box {
  height: 100%;
  .code-tree {
    height: calc(100% - 22px);
    margin-top: 5px;
    border: 1px solid #e4e4e4;
    .tree-list {
      height: calc(100% - 50px);
      overflow: auto;
    }
  }
}
</style>

