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
          <el-button icon="el-icon-plus"
                     @click="addRole()">添加</el-button>
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
                         fixed="right"
                         width="300"
                         label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button type="info"
                       plain
                       size="mini"
                       @click="qxSetting(scope.row)">权限设置</el-button>
            <el-button type="primary"
                       plain
                       size="mini"
                       @click="updateOption(scope.row)">修改</el-button>
            <el-button type="success"
                       plain
                       size="mini"
                       @click="personnelAllotment(scope.row)">人员分配</el-button>
          </template>
        </el-table-column>
      </basic-table>
    </div>
    <el-dialog v-el-drag-dialog
               :close-on-click-modal='true'
               :title="dialogTitle[operateStatus]"
               :visible.sync="formVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-addOrUpdate">
        <update-form ref="updateFrom"
                     :updateFormData="updateFormData"></update-form>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="dialogTitle[operateStatus]"
               v-el-drag-dialog
               :visible.sync="peopleFormVisible"
               :close-on-click-modal='false'
               width="80%"
               top="8vh"
               custom-class="dialog-default role-management-dialog no-footer">
      <div class="dialog-contant-default"
           v-if="peopleFormVisible">
        <rMPA @searchOption="searchOption"
              v-if="operateStatus === 4"
              ref="personDistribution"
              :paramData='paramData'></rMPA>
        <el-tabs @tab-click="handleClick"
                 v-model="activeName"
                 v-if="operateStatus === 5 && peopleFormVisible"
                 type="card">
          <el-tab-pane v-for="item in permissionList"
                       :key="item.permissionId"
                       :label="item.permissionName"
                       :name="item.permissionId + ''">
            <!--功能权限 -->
            <FP v-if="item.dataCategory === '0' && paramData.permissionId === item.permissionId + ''"
                :paramData='paramData'></FP>
            <!--表权限-->
            <TP v-if="(item.dataCategory === '1' || item.dataCategory === '2') && paramData.permissionId === item.permissionId + ''"
                :paramData='paramData'></TP>
            <!--数据权限-->
            <data-permission v-if="item.dataCategory === '5' && paramData.permissionId === item.permissionId + ''"
                             :paramData='paramData'></data-permission>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import { baseRequest } from '@/api/base'
import elDragDialog from '@/directive/el-dragDialog'
import rMPA from './personnelAllotment'
import FP from '../userManagement/components/functionalPermissions'
import TP from '../userManagement/components/tablePermissions'
import dataPermission from '../userManagement/components/businessLine'
const url = '/basic/roles/selects'
export default {
  directives: { elDragDialog },
  name: 'roleManagementIndex',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm,
    rMPA,
    FP,
    TP,
    dataPermission
  },
  data() {
    return {
      configData: {}, // 模板数据
      searchToggle: true,
      tableToggle: true,
      updateFormData: null, // 弹框数据
      formVisible: false, // 弹框开关
      peopleFormVisible: false, // 弹框开关
      languageData: null, // 语言设置数据
      operateStatus: null, // 操作选项
      msgId: null, // 修改保存参数id
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改',
        4: '人员分配',
        5: '授权'
      },
      activeName: '1',
      paramData: {
        roleId: null,
        permissionId: null
      },
      permissionList: []
    }
  },
  created() {
    this.getOption()
  },
  methods: {
    searchOption() {
      const param = this.$refs.searchForm.searchParam()
      this.$refs.basicTable.getData(url, param)
    },
    getOption() {
      baseRequest(url, { urlMode: '1' }).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        result.tableConfig = JSON.parse(result.tableConfig)
        this.configData = result
        this.$nextTick(() => {
          this.searchOption()
        })
      })
      // 获取所有的标签页
      baseRequest('/basic/permissions/getPermissionList', { role: 1, orderBySection: 'DATA_CATEGORY,PERMISSION_TYPE' }).then(response => {
        this.permissionList = response.data.item
        this.paramData.permissionId = response.data.item[0].permissionId + ''
        this.$nextTick(_ => {
          this.activeName = response.data.item[0].permissionId + ''
        })
      })
    },
    // 点击添加
    addRole() {
      this.operateStatus = 1
      this.getAddForm()
    },
    // 获取添加表单
    getAddForm() {
      baseRequest('/basic/roles/select', { urlMode: '1' }).then(response => {
        response.data.item = {}
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        this.updateFormData = result
        this.formVisible = true
        this.$nextTick(function() {
          this.$refs.updateFrom.clearValidate()
        })
      })
    },
    // 人员分配
    personnelAllotment(row) {
      this.paramData.roleId = row.role_id
      this.operateStatus = 4
      this.peopleFormVisible = true
      this.$nextTick(function() {
        this.$refs.personDistribution.getOption()
      })
    },
    // 权限设置
    qxSetting(row) {
      this.paramData.roleId = row.role_id
      this.paramData.permissionId = '1'
      this.operateStatus = 5
      this.activeName = this.permissionList[0].permissionId + ''
      this.peopleFormVisible = true
    },
    handleClick(tab) {
      this.paramData.permissionId = tab.name
    },
    // 修改表单
    updateOption(row) {
      this.operateStatus = 2
      this.getUpdateForm(row)
    },
    // 获取修改表单
    getUpdateForm(row) {
      baseRequest('/basic/roles/select', { roleId: row.role_id }).then(response => {
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
      this.$refs.updateFrom.saveRequest('/basic/roles/add').then(() => {
        this.searchOption()
        this.$Message.success('操作成功')
        this.formVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-addOrUpdate {
  margin-top: 10px;
  padding: 50px;
  border: 0px;
}
.dialog-footer-addOrUpdate {
  margin-top: 0px;
}
</style>
<style lang="scss">
.role-management-dialog {
  &.dialog-default {
    height: 85%;
  }
  .el-tabs__header {
    margin: 0;
  }
}
</style>


