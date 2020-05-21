/*
 * @Author: M.HQ 
 * @Date: 2019-09-25 16:28:06 
 * @Last Modified by: wk
 * @Last Modified time: 2020-05-20 14:22:12
 * @Description: 权限查看
 */
<template>
  <el-dialog title="权限查看"
             v-el-drag-dialog
             :visible.sync="formVisible"
             :close-on-click-modal='false'
             width="80%"
             top="8vh"
             @close='closeDialog'
             custom-class="dialog-default user-management-dialog no-footer">
    <div class="dialog-contant-default roleManagement"
         v-if="formVisible">
      <el-tabs v-model="activeName"
               type="card">
        <el-tab-pane v-for="item in permissionList"
                     :key="item.permissionId"
                     :label="item.permissionName"
                     :name="item.permissionId + ''">
          <menu-view :paramData='paramData'
                     :permissionId='item.permissionId'
                     v-if="item.dataCategory === '0'"></menu-view>
          <table-view :paramData='paramData'
                      :permissionId='item.permissionId'
                      v-if="item.dataCategory === '1' || item.dataCategory === '2'"></table-view>
          <column-view :paramData='paramData'
                       :permissionId='item.permissionId'
                       v-if="item.dataCategory === '3' || item.dataCategory === '4'"></column-view>
          <data-view :paramData='paramData'
                     :permissionId='item.permissionId'
                     v-if="item.dataCategory === '5'"></data-view>
          <role-list v-if="!item.dataCategory"
                     :paramData='paramData'></role-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import menuView from './menuView'
import tableView from './tableView'
import dataView from './businessLine'
import columnView from './columnView'
import roleList from './roleList'
import { baseRequest } from '@/api/base'
export default {
  directives: {},
  name: 'userManagementComponentsPermissionViewViewDialog',
  components: {
    SearchForm,
    BasicTable,
    menuView,
    tableView,
    dataView,
    columnView,
    roleList
  },
  props: {
    paramData: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      formVisible: false, // 弹框开关
      userId: null,
      activeName: '',
      permissionList: []
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.dialogHeight / 0.75 * 0.85 - 360
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    openDialog() {
      this.formVisible = true
      this.activeName = this.permissionList[0].permissionId + ''
    },
    getPermissionList() {
      // 获取所有的标签页
      baseRequest('/basic/users/getPermissionList', { orderBySection: 'DATA_CATEGORY,PERMISSION_TYPE' }).then(response => {
        this.permissionList = response.data.item
        this.permissionList.push({
          permissionId: 'abc',
          permissionName: '角色列表'
        })
        this.paramData.permissionId = response.data.item[0].permissionId + ''
        this.$nextTick(_ => {
          this.activeName = response.data.item[0].permissionId + ''
        })
      })
    },
    closeDialog() {
      this.activeName = null
    },
    handleClick(tab) {
      this.paramData.permissionId = tab.name
    }
  }
}
</script>

