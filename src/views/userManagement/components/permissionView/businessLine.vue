/*
 * @Author: M.HQ 
 * @Date: 2019-09-26 15:04:57 
 * @Last Modified by: wk
 * @Last Modified time: 2020-05-20 14:28:18
 * @Description: 数据权限查看
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
              <span class="input-label">实体名称</span>
              <el-input class="form-input"
                        v-model="searchData.entityName"
                        clearable></el-input>
            </el-form-item>
          </div>
          <div class="input-both-4">
            <el-form-item>
              <span class="input-label">实体代码</span>
              <el-input class="form-input"
                        v-model="searchData.entityCode"
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

        <el-table-column prop="entity_name"
                         label="实体名称"
                         align="center">
        </el-table-column>

        <el-table-column prop="entity_code"
                         label="实体代码"
                         align="center">
        </el-table-column>

        <el-table-column width="250"
                         prop="valid_time"
                         label="生效时间"
                         align="center">
        </el-table-column>

        <el-table-column width="250"
                         prop="invalid_time"
                         label="失效时间"
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

        <el-table-column width="250"
                         prop="role_name"
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
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import { baseRequest } from '@/api/base'
import elDragDialog from '@/directive/el-dragDialog'
const url = '/basic/users/getUserAllDataPermission'
export default {
  directives: { elDragDialog },
  name: 'userManagementComponentsPermissionViewBusinessLine',
  components: {
    SearchForm,
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
        entityCode: '',
        entityName: '',
        status: ''
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
      this.searchData.entityCode = ''
      this.searchData.entityName = ''
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
        entityCode: this.searchData.entityCode,
        entityName: this.searchData.entityName
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

