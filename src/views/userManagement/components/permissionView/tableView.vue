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
                     @click="restSearch">重置</el-button>
          <a @click="searchToggle=false"
             v-if="searchToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="searchToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <div v-show="searchToggle"
           class="form-search">
        <el-form ref="formHeard"
                 :inline="true"
                 :model="searchData"
                 class="demo-table-expand">
          <div class="input-both-4">
            <el-form-item>
              <span class="input-label">表名</span>
              <el-input class="form-input"
                        v-model="searchData.tableName"
                        clearable></el-input>
            </el-form-item>
          </div>
          <div class="input-both-4">
            <el-form-item>
              <span class="input-label">权限状态</span>
              <el-select class="form-input"
                         v-model="searchData.status"
                         size="medium"
                         clearable
                         style="width:255px"
                         placeholder="">
                <el-option label="有效"
                           value="1"></el-option>
                <el-option label="无效"
                           value="0"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="input-both-4">
            <el-form-item>
              <span class="input-label">来源</span>
              <el-select class="form-input"
                         v-model="searchData.permissionSource"
                         size="medium"
                         clearable
                         style="width:255px"
                         placeholder="">
                <el-option label="人员"
                           value="1"></el-option>
                <el-option label="角色"
                           value="2"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
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
      <el-table :data="tableData"
                :height='tableHeight'
                border
                style="width: 100%"
                v-loading="listLoading"
                element-loading-text="给我一点时间">
        <el-table-column type="index"
                         width="50">
        </el-table-column>

        <el-table-column prop="ds_name"
                         width="200"
                         label="数据源"
                         align="center">
        </el-table-column>

        <el-table-column prop="schema_name"
                         label="用户名"
                         align="center"
                         width="200">
        </el-table-column>

        <el-table-column prop="table_name"
                         label="表名"
                         align="center">
        </el-table-column>

        <el-table-column label="权限状态"
                         width="150"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.field_convert_map.status}}
          </template>
        </el-table-column>

        <el-table-column label="来源"
                         width="150"
                         align="center">
          <template slot-scope="scope">
            {{permissionSourceList[scope.row.permissionsource]}}
          </template>
        </el-table-column>

        <el-table-column prop="role_name"
                         width="250"
                         label="角色名称"
                         align="center">
        </el-table-column>

      </el-table>
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pageNo"
                     :total="total"
                     layout="total, sizes, prev, pager, next, jumper"
                     :page-sizes="[15,20,25]"
                     :page-size="pageSize">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import BasicTable from 'basic-table-ry'
import { baseRequest } from '@/api/base'
const url = '/basic/users/getUserAllTablePermission'
export default {
  name: 'userManagementComponentsPermissionViewTableView',
  components: {
    BasicTable
  },
  props: {
    paramData: {
      type: [Object, Array]
    },
    permissionId: Number
  },
  data() {
    return {
      listLoading: false, // 加载圆圈是否显示
      pageNo: 1,
      total: null,
      pageSize: null,
      tableData: [], // 模板数据
      searchToggle: true,
      tableToggle: true,
      permissionSourceList: {
        1: '用户',
        2: '角色'
      },
      searchData: {
        tableName: '',
        status: '',
        permissionSource: ''
      }
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.dialogHeight / 0.75 * 0.85 - 360
    }
  },
  created() {
    this.searchOption()
  },
  methods: {
    restSearch() {
      this.searchData.status = ''
      this.searchData.tableName = ''
      this.searchData.permissionSource = ''
      this.searchOption()
    },
    searchOption(page) {
      this.listLoading = true
      if (!page) {
        this.pageNo = 1
      }
      const param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        permissionId: this.permissionId,
        userId: this.paramData.userId,
        urlMode: '2',
        status: this.searchData.status,
        tableName: this.searchData.tableName,
        permissionSource: this.searchData.permissionSource
      }
      baseRequest(url, param).then(response => {
        this.total = response.data.total
        this.tableData = response.data.item
        this.listLoading = false
      })
    },
    handleSizeChange(val) { // 分页
      this.pageSize = val
      this.searchOption()
    },
    handleCurrentChange(val) { // 分页
      this.pageNo = val
      this.searchOption(true)
    }
  }
}
</script>