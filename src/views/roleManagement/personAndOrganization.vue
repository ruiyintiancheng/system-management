<template>
      <el-dialog v-el-drag-dialog append-to-body :close-on-click-modal='false'  title="添加" :visible.sync="formVisible" width="60%" custom-class="dialog-default">
        <div class="dialog-contant-default">
          <div class="base-row">
            <div class="row-botton clearfix">
              <div class="row-title">
                <svg-icon icon-class="search" />
                <span>数据列表</span>
              </div>
              <div class="row-option">
                <el-button icon="el-icon-search" @click="searchOption" type="primary">查询</el-button>
                <el-button icon="el-icon-refresh" @click="getOption" >重置</el-button>
                <a @click="searchToggle=false" v-if="searchToggle"><svg-icon icon-class="up" />&nbsp;收起</a>
                <a  @click="searchToggle=true" v-else><svg-icon icon-class="down"/>&nbsp;展开</a>
              </div>
            </div>
            <search-form v-show="searchToggle" ref="searchForm" :inputCount="3" :searchFormData="configData"></search-form>
          </div>
          <div class="base-row">
              <div class="row-botton clearfix">
                <div class="row-title">
                  <svg-icon icon-class="ul" />
                  <span>筛选查询</span>
                </div>
                <div class="row-option">
                  <a @click="tableToggle=false" v-if="tableToggle"><svg-icon icon-class="up" />&nbsp;收起</a>
                  <a  @click="tableToggle=true" v-else><svg-icon icon-class="down"/>&nbsp;展开</a>
                </div>
              </div>
            <basic-table v-show="tableToggle" :height='tableHeight' ref="basicTable" :tableOption="configData" :pagenation="true" :rowNum="false" :rowCheck="true">
            </basic-table>
          </div>  
          <div slot="footer" class="dialog-footer">
            <span style="position:absolute; right:40px; bottom:20px;">
              <el-button @click="formVisible = false">取消</el-button>
              <el-button type="primary" @click="saveOperate()">保存</el-button>
            </span>
          </div>
        </div>
      </el-dialog>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
// import { getSearchParam } from '@/utils/index'
import { baseRequest } from '@/api/base'
import './personnelAllotment'
const url = '/users/getAllUser'
export default {
  directives: { },
  name: 'roleManagementPersonAndOrganization',
  components: {
    SearchForm,
    BasicTable
  },
  props: {
    paramData: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      configData: {}, // 模板数据
      searchToggle: true,
      tableToggle: true,
      formVisible: false
    }
  },
  created() {
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.dialogHeight - 370
    }
  },
  methods: {
    openDialog() {
      this.formVisible = true
      this.getOption()
    },
    searchOption() {
      const param = this.$refs.searchForm.searchParam()
      param.roleId = this.paramData.roleId
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
    },
    saveOperate() {
      const checkeds = this.$refs.basicTable.getSelect()
      if (!checkeds || checkeds.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先选择要添加的用户!'
        })
        return
      }
      const checkedArr = []
      for (var index = 0; index < checkeds.length; index++) {
        checkedArr.push(checkeds[index].userId)
      }
      const param = {
        roleId: this.paramData.roleId,
        userIds: checkedArr
      }
      baseRequest('/roles/addUser', param).then(response => {
        this.$emit('flashTable')
        this.$Message.success('操作成功')
        this.formVisible = false
      })
    }
  }
}
</script>

