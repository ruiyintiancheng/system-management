<template>
  <div class="app-container"
       style="margin-left:5px;">
    <el-row>
      <!-- 树开始 -->
      <el-col :span="5"
              class="code-tree"
              :style="{height:containHeight + 'px'}">
        <div class="row-botton clearfix">
          <div class="row-title">
            <svg-icon icon-class="tree" />
            <span>代码树</span>
          </div>
        </div>
        <el-tree :data="treeData"
                 default-expand-all
                 node-key="id"
                 ref="tree"
                 highlight-current
                 :expand-on-click-node="false"
                 :props="defaultProps"
                 @node-click="handleNodeClick">
        </el-tree>
      </el-col>
      <!-- 树结束 -->
      <!-- 表格开始 -->
      <el-col :span="19">
        <!-- 查询区域开始 -->
        <div class="base-row">
          <div class="row-botton clearfix">
            <div class="row-title">
              <svg-icon icon-class="search" />
              <span>筛选查询</span>
            </div>
            <div class="row-option">
              <el-button v-if="buttonToggle"
                         icon="el-icon-search"
                         @click="searchOption"
                         type="primary">查询</el-button>
              <el-button v-if="buttonToggle"
                         icon="el-icon-refresh"
                         @click="reset">重置</el-button>
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
        <!-- 查询区域结束 -->
        <!-- 表格数据开始 -->
        <div class="base-row">
          <div class="row-botton clearfix">
            <div class="row-title">
              <svg-icon icon-class="ul" />
              <span>数据列表</span>
            </div>
            <div class="row-option">
              <el-button v-if="buttonToggle"
                         icon="el-icon-plus"
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
                             width="200">
              <template slot-scope="scope">
                <el-button type="primary"
                           size="mini"
                           plain
                           @click="updateOption(scope.row)">修改</el-button>
                <el-button type="success"
                           size="mini"
                           plain
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
import { getSearchParam } from '@/utils/index'
import { baseRequest } from '@/api/base'
const url = '/basic/system/codeManage'
const codeSortListUrl = '/basic/system/codeManage/codeSortList'
export default {
  name: 'systemManagementCodeManagementIndex',
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
        label: 'msgText'
      },
      configData: {}, // 表格数据
      updateFormData: null, // 弹框数据
      formVisible: false, // 弹框开关
      searchToggle: true, // 查询下拉切换
      tableToggle: true, // 表格下拉切换
      buttonToggle: false, // 按钮点击树切换
      treeId: null, // 左侧树id,
      operateStatus: null,
      dictId: null, // 添加下级和修改保存参数id
      containHeight: null,
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '添加下级',
        3: '修改'
      }
    }
  },
  created() {
    this.getOption()
    this.containHeight = this.$store.state.app.containHeight - 16
  },
  methods: {
    // 点击查询
    searchOption() {
      const param = this.$refs.searchForm.searchParam()
      param.parentDictId = this.treeId
      param.orderBySection = 'DISP_ORDER'
      if (this.treeId === 1) {
        this.$refs.basicTable.getData(codeSortListUrl, param)
      } else {
        this.$refs.basicTable.getData(url, param)
      }
    },
    // 初始化数据
    getOption() {
      this.getTree()
      baseRequest(url).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        result.tableConfig = JSON.parse(result.tableConfig)
        this.configData = result
      })
    },
    // 获取树数据
    getTree() {
      baseRequest('/basic/dicts/getCodeTreeEast').then(response => {
        this.treeData = response.data.item
      })
    },
    // 重置
    reset() {
      this.$refs.searchForm.resetForm()
    },
    // 点击树切换数据
    handleNodeClick(data) {
      this.treeId = data.dictId
      const treesign = this.treeId
      if (treesign === 1) {
        baseRequest(codeSortListUrl).then(response => {
          const result = response.data
          result.formConfig = JSON.parse(result.formConfig)
          result.tableConfig = JSON.parse(result.tableConfig)
          this.configData = result
          const param = getSearchParam(result.formConfig)
          param.orderBySection = 'DISP_ORDER'
          this.$refs.basicTable.getData(codeSortListUrl, param)
        })
      } else {
        baseRequest(url).then(response => {
          const result = response.data
          result.formConfig = JSON.parse(result.formConfig)
          result.tableConfig = JSON.parse(result.tableConfig)
          this.configData = result
          const param = getSearchParam(result.formConfig)
          param.orderBySection = 'DISP_ORDER'
          this.$refs.basicTable.getData(url, param)
        })
      }
      // this.$refs.searchForm.resetForm()
      // this.searchOption()
      this.buttonToggle = true
    },
    // 点击添加
    addOption() {
      this.operateStatus = 1
      this.getAddForm()
    },
    // 点击添加下级
    addChildren(row) {
      this.operateStatus = 2
      this.dictId = row.dictId
      this.getAddForm()
    },
    // 修改表单
    updateOption(row) {
      this.operateStatus = 3
      this.dictId = row.dictId
      this.getUpdateForm(row)
      this.updateData.代码 = row.代码
      this.updateData.代码值 = row.代码值
      this.updateData.显示顺序 = row.显示顺序
    },
    // 获取添加表单
    getAddForm(row) {
      if (this.updateFormData === null) {
        const param = { urlMode: 1 }
        baseRequest('/basic/resource/getAddDataEast', param).then(response => {
          response.data.item = {}
          const result = response.data
          result.formConfig = JSON.parse(result.formConfig)
          // result.validator = JSON.parse(result.validator)
          this.updateFormData = result
          this.formVisible = true
          this.$nextTick(function() {
            this.$refs.updateFrom.clearValidate()
          })
        })
      } else {
        this.formVisible = true
        this.updateFormData.item = {}
        this.$nextTick(function() {
          this.$refs.updateFrom.clearValidate()
        })
      }
    },
    // 获取修改表单
    getUpdateForm(row) {
      const param = { dictId: row.dictId }
      baseRequest('/basic/resource/getAddDataEast', param).then(response => {
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
    // 保存操作
    saveOperate() {
      const param = this.$refs.updateFrom.getFormData()
      if (this.operateStatus === 1) {
        param.parentDictId = this.treeId
        baseRequest('/basic/dicts/saveAdd', param).then(response => {
          this.searchOption()
          this.$Message.success('操作成功')
        })
      } else if (this.operateStatus === 2) {
        param.parentDictId = this.dictId
        console.log(param)
        baseRequest('/basic/dicts/saveAdd', param).then(response => {
          this.getTree()
          this.$Message.success('操作成功')
        })
      } else {
        baseRequest('/basic/dicts/saveUpdate', param).then(response => {
          this.searchOption()
          this.$Message.success('操作成功')
        })
      }
      this.formVisible = false
    }
  }
}
</script>
<style scoped>
.code-tree {
  margin-top: 5px;
  overflow: auto;
  position: relative;
  border: 1px solid #e4e4e4;
}
</style>