/*
 * @Author: lk 
 * @Date: 2019-02-15 15:49:59 
 * @Last Modified by: lk
 * @Last Modified time: 2019-03-12 18:10:17
 * @Description:  公告管理-发布
 */
<template>
  <div class="release-form">
    <el-dialog title="发布"
               v-el-drag-dialog
               :close-on-click-modal='true'
               :visible.sync="releaseFormVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-release middle-dialog-option">
        <update-form ref="updateFrom"
                     :updateFormData="updateFormData"
                     :elFunction="elFunction">
        </update-form>
        <el-form ref="form"
                 :model="item"
                 label-position="left"
                 label-width="100px"
                 class="baseUpdate-form">
          <el-form-item prop="roleIds"
                        label="选择角色">
            <el-select class="form-input select-dialog-option"
                       collapse-tags
                       multiple
                       v-model="item.roleIds"
                       clearable
                       placeholder="">
              <el-option v-for="item in roleList"
                         :key="item.id"
                         :value="item.id"
                         :label="item.name"></el-option>
              <a style="margin-left:5px;"
                 slot="prefix"
                 class="el-icon-search"
                 @click.stop="chooseHandle(1)"></a>
            </el-select>
          </el-form-item>
          <el-form-item prop="userIds"
                        label="选择用户">
            <el-select class="form-input select-dialog-option"
                       collapse-tags
                       multiple
                       v-model="item.userIds"
                       clearable
                       placeholder="">
              <el-option v-for="item in userList"
                         :key="item.id"
                         :value="item.id"
                         :label="item.name"></el-option>
              <a style="margin-left:5px;"
                 slot="prefix"
                 class="el-icon-search"
                 @click.stop="chooseHandle(2)"></a>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="releaseFormVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
      <el-dialog :title="userRoleStatus === 1?'选择角色':'选择用户'"
                 append-to-body
                 v-el-drag-dialog
                 :close-on-click-modal='true'
                 :visible.sync="userRoleDialog"
                 width="35%"
                 custom-class="dialog-default">
        <div class="dialog-contant-default">
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
                <a @click="resSelSearchToggle=false"
                   v-if="resSelSearchToggle">
                  <svg-icon icon-class="up" />&nbsp;收起</a>
                <a @click="resSelSearchToggle=true"
                   v-else>
                  <svg-icon icon-class="down" />&nbsp;展开</a>
              </div>
            </div>
            <search-form v-show="resSelSearchToggle"
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
                <a @click="resSelTableToggle=false"
                   v-if="resSelTableToggle">
                  <svg-icon icon-class="up" />&nbsp;收起</a>
                <a @click="resSelTableToggle=true"
                   v-else>
                  <svg-icon icon-class="down" />&nbsp;展开</a>
              </div>
            </div>
            <basic-table v-show="resSelTableToggle"
                         ref="basicTable"
                         :height="tableHeight"
                         :tableOption="configData"
                         :pagenation="true">
              <template slot="firstColumn">
                <el-table-column align="center"
                                 width="50"
                                 type="selection">
                </el-table-column>
              </template>
            </basic-table>
          </div>
        </div>
        <div slot="footer"
             class="dialog-footer">
          <el-button @click="userRoleDialog = false">取消</el-button>
          <el-button @click="userRoleSave"
                     type="primary">保存</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import { getSearchParam } from '@/utils/index'
import { baseRequest } from '@/api/base'
const roleUrl = '/basic/roles/selectsForNotice'
const userUrl = '/basic/users/selectsForNotice'
export default {
  components: {
    SearchForm,
    BasicTable,
    UpdateForm
  },
  data() {
    return {
      noticeTitle: '',
      configData: {},
      releaseFormVisible: false,
      updateFormData: null, // 弹框数据
      userRoleDialog: false, // 用户角色选择弹框
      userRoleStatus: 1, // 用户角色选择 1角色 2用户
      roleList: [], // 角色选项
      userList: [],
      resSelSearchToggle: true,
      resSelTableToggle: true,
      // 发布参数
      item: {
        userIds: '',
        roleIds: ''
      },
      elFunction: {
        afterToday: {
          disabledDate(time) {
            return time.getTime() <= Date.now() - 8.64e7
          }
        }
      }
    }
  },
  computed: {
    tableHeight: function() {
      return this.$store.state.app.dialogHeight - 350
    }
  },
  methods: {
    // 发布公告
    release(row) {
      this.noticeTitle = row.noticeTitle
      this.releaseFormVisible = true
      this.updateFormData = {}
      baseRequest('/basic/notices/select', { noticeId: row.noticeId }).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        this.updateFormData = result
        this.$nextTick(function() {
          this.$refs.updateFrom.clearValidate()
        })
      })
      baseRequest('/basic/notices/checkedRoleUser', { noticeId: row.noticeId }).then(response => {
        const result = response.data.item
        this.roleList = result.roleList
        this.userList = result.userList
        this.item.roleIds = result.roleIds
        this.item.userIds = result.userIds
      })
    },
    // 点击选择角色用户
    chooseHandle(type) {
      // this.tableHeight = document.querySelector('.dialog-contant-release.middle-dialog-option').offsetHeight - 100
      this.userRoleDialog = true
      this.userRoleStatus = type
      this.getOption()
    },
    searchOption() {
      this.$refs.basicTable.getData(this.userRoleStatus === 1 ? roleUrl : userUrl, this.$refs.searchForm.searchParam())
    },
    getOption() {
      baseRequest(this.userRoleStatus === 1 ? roleUrl : userUrl, { 'urlMode': '1' }).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        result.tableConfig = JSON.parse(result.tableConfig)
        this.configData = result
        const param = getSearchParam(result.formConfig)
        this.$refs.basicTable.getData(this.userRoleStatus === 1 ? roleUrl : userUrl, param).then((data) => {
          this.$nextTick(function() {
            for (const iterator of this.$refs.basicTable.data) {
              for (const id of this.item[this.userRoleStatus === 1 ? 'roleIds' : 'userIds']) {
                if (iterator[this.userRoleStatus === 1 ? 'role_id' : 'userId'] === id) {
                  this.$refs.basicTable.$refs.basicTable.toggleRowSelection(iterator, true)
                }
              }
            }
          })
        })
      })
    },
    // 保存操作
    saveOperate() {
      const param = this.$refs.updateFrom.formData
      param.userIds = this.item.userIds
      param.roleIds = this.item.roleIds
      param.noticeTitle = this.noticeTitle
      this.$refs.updateFrom.saveRequest('/notices/publish', param).then(() => {
        this.$emit('searchOption')
        this.$Message.success('操作成功')
        this.releaseFormVisible = false
      })
    },
    // 选择用户和角色保存
    userRoleSave() {
      const id = this.userRoleStatus === 1 ? 'role_id' : 'userId'
      const name = this.userRoleStatus === 1 ? 'role_name' : 'userName'
      const ids = this.userRoleStatus === 1 ? 'roleIds' : 'userIds'
      const list = this.userRoleStatus === 1 ? 'roleList' : 'userList'
      const rows = this.$refs.basicTable.getSelect()
      for (const iterator of rows) {
        const rowOption = this[list].find((item) => {
          return item.id === iterator[id]
        })
        const rowValue = this.item[ids].find((item) => {
          return item === iterator[id]
        })
        if (!rowOption) {
          const item = {
            id: iterator[id],
            name: iterator[name]
          }
          this[list].push(item)
        }
        if (!rowValue) {
          this.item[ids].push(iterator[id])
        }
      }
      this.userRoleDialog = false
    }
  }
}
</script>
<style scoped>
.dialog-contant-default {
  margin-top: 10px;
  padding: 0px;
  border: 0px;
}
.dialog-contant-release {
  margin-top: 10px;
  padding: 50px;
  border: 0px;
}
</style>
<style lang="scss">
.form-input.select-dialog-option {
  .el-select__tags {
    margin-left: 25px;
  }
}
.middle-dialog-option {
  .form-input,
  .el-date-editor.el-input.form-input {
    width: 200px;
  }
  .baseUpdate-form {
    margin-left: calc(50% - 150px);
  }
}
</style>
