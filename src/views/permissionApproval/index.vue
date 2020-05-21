/*
 * @Author: 1k 
 * @Date: 2019-09-17 10:48:39 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-09-27 17:07:14
 * @Description:  权限审批
 */
 <template>
  <div class="notifacation-ma">
    <div class="base-row">
      <div class="row-botton clearfix">
        <div class="row-title">
          <svg-icon icon-class="search" />
          <span>筛选查询</span>
        </div>
        <div class="row-option">
          <!-- <a href="javascript:void(0)" class="button" @click="searchOption">查询</a> -->
          <el-button icon="el-icon-search"
                     @click="searchOption"
                     type="primary">查询</el-button>
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
          <div class="input-both-3">
            <el-form-item>
              <span class="input-label">审核状态</span>
              <el-select class="form-input"
                         v-model="searchData.status"
                         size="medium"
                         clearable
                         style="width:255px"
                         placeholder="">
                <el-option label=" 未审核"
                           value="1"></el-option>
                <el-option label="审核通过"
                           value="2"></el-option>
                <el-option label="审核未通过"
                           value="3"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <!-- <div class="input-both-3">
            <el-form-item>
              <span class="input-label">通知类型:</span>
              <el-select class="form-input"
                         v-model="searchData.noticeType"
                         size="small"
                         clearable>
                <el-option label="全部"
                           value="0"></el-option>
                <el-option label="开始计算"
                           value="1"></el-option>
                <el-option label="计算完成"
                           value="2"></el-option>
                <el-option label="计算失败"
                           value="3"></el-option>
              </el-select>
            </el-form-item>
          </div> -->
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
          <!-- <el-button icon="el-icon-plus"
                     @click="openAddSqoop">添加</el-button> -->
          <a @click="tableToggle=false"
             v-if="tableToggle">
            <svg-icon icon-class="up" />&nbsp;收起</a>
          <a @click="tableToggle=true"
             v-else>
            <svg-icon icon-class="down" />&nbsp;展开</a>
        </div>
      </div>
      <div v-show="tableToggle">
        <!-- 表格 -->
        <el-table ref="basicTable"
                  :data="configData"
                  style="width: 100%;"
                  v-loading="listLoading"
                  element-loading-text="给我一点时间"
                  :height="getDefaultHeight()"
                  stripe
                  border
                  highlight-current-row
                  fit
                  header-cell-class-name="ai-el-table-header">
          <el-table-column width=50
                           type="index"
                           align="center"
                           fixed="left"
                           label="序号"></el-table-column>
          <el-table-column :min-width="140"
                           align='center'
                           label="功能名称">
            <template slot-scope="scope">
              {{scope.row.field_convert_map.msgId}}
            </template>
          </el-table-column>
          <el-table-column :min-width="120"
                           align='center'
                           label="申请用户">
            <template slot-scope="scope">
              {{scope.row.userName}}
            </template>
          </el-table-column>
          <el-table-column :min-width="140"
                           align='center'
                           label="申请信息">
            <template slot-scope="scope">
              {{scope.row.submitMsg}}
            </template>
          </el-table-column>
          <el-table-column :min-width="100"
                           align='center'
                           label="审核状态">
            <template slot-scope="scope">
              {{options.status[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column :min-width="140"
                           align='center'
                           label="审核信息">
            <template slot-scope="scope">
              <el-tooltip :disabled="textJug(scope.row.auditMsg)"
                          :content="scope.row.auditMsg"
                          placement="top"
                          visible-arrow
                          effect="light">
                <div class="basic-table-column">
                  {{scope.row.auditMsg }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :min-width="160"
                           align='center'
                           label="审核时间">
            <template slot-scope="scope">
              {{scope.row.auditTime}}
            </template>
          </el-table-column>
          <el-table-column :min-width="160"
                           align='center'
                           label="有效时间">
            <template slot-scope="scope">
              {{scope.row.validTime }}
            </template>
          </el-table-column>
          <el-table-column :min-width="150"
                           label="操作"
                           fixed="right"
                           align="center">
            <template slot-scope="scope">
              <el-button plain
                         type="primary"
                         size="mini"
                         v-if="scope.row.status==='1'"
                         @click="openAddSqoop(scope.row)">审核</el-button>
              <el-button type="info"
                         plain
                         size="mini"
                         @click="openColumn(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column :min-width="150"
                           align='center'
                           label="数据采集模板类型">
            <template slot-scope="scope">
              {{options.collectTemplateType[scope.row.collectTemplateType]}}
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="pageNo"
                       :total="total"
                       layout="total, sizes, prev, pager, next, jumper"
                       :page-sizes="[10,15,20]"
                       :page-size="pageSize">
        </el-pagination>
      </div>
    </div>
    <!-- 审核-->
    <el-dialog title="审核"
               v-el-drag-dialog
               :visible.sync="formVisible"
               width="40%"
               custom-class="dialog-default">
      <div class="dialog-contant-default-addOrUpdate">
        <el-form class="baseUpdate-form"
                 ref="form"
                 :rules="addRules"
                 style="margin-left:60px"
                 :model="updateFormData"
                 label-width="100px">
          <el-form-item label="审核状态"
                        prop="status">
            <el-select v-model="updateFormData.status"
                       size="small"
                       clearable
                       placeholder="">
              <el-option label="审核通过"
                         value="2"></el-option>
              <el-option label="审核未通过"
                         value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="有效时间"
                        v-if="updateFormData.status==='2'">
            <el-date-picker v-model="updateFormData.validTime"
                            type="datetime"
                            value-format='yyyy-MM-dd HH:mm:ss'
                            placeholder="">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="审核信息">
            <el-input type="textarea"
                      style="width:300px"
                      v-model="updateFormData.auditMsg"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
    </el-dialog>

    <!-- 查看列表 -->
    <el-dialog :close-on-click-modal="false"
               v-el-drag-dialog
               title="权限配置信息"
               append-to-body
               :visible.sync="toConfigure"
               width="70%"
               custom-class="dialog-default">
      <div class="dialog-contant-default-addOrUpdate">
        <el-table ref="seeTable"
                  :data="toConfigureData"
                  style="width: 100%;"
                  v-loading="listLoading"
                  element-loading-text="给我一点时间"
                  :height="defaultHeight()"
                  stripe
                  border
                  highlight-current-row
                  fit
                  header-cell-class-name="ai-el-table-header">
          <el-table-column width=50
                           type="index"
                           align="center"
                           fixed="left"
                           label="序号"></el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           label="数据源">
            <template slot-scope="scope">
              {{scope.row.dsname}}
            </template>
          </el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           label="用户 ">
            <template slot-scope="scope">
              {{scope.row.schemaname}}
            </template>
          </el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           label="表名">
            <template slot-scope="scope">
              {{scope.row.tablename }}
            </template>
          </el-table-column>
          <el-table-column :min-width="150"
                           align='center'
                           label="字段名称">
            <template slot-scope="scope">
              {{scope.row.columnname  }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer"
           class="dialog-footer-addOrUpdate">
        <el-button @click="toConfigure = false">关闭</el-button>
        <!-- <el-button type="primary"
                   @click="saveOperate()">保存</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import excelFile from './components/excelFile'

import { baseSearch } from '@/api/base'
import { baseRequest } from '@/api/base'
import { saveUpdate } from '@/utils/validate'
export default {
  directives: {},
  name: 'templateFileRecordingIndex',
  components: {
  },
  mounted() {
    this.searchOption()
  },
  created() {

  },
  data() {
    return {
      toConfigureData: null,
      toConfigure: false,
      updateFormData: {
        status: null,
        auditMsg: null,
        validTime: null,
        auditId: null
      },
      addRules: {// 校验
        status: [{
          required: true, message: '请选择审核状态'
        }]
      },
      formVisible: false, // 弹框开关
      operateStatus: null, // 操作选项
      dialogTitle: { // 弹框标题
        1: '添加',
        2: '修改'
      },
      tableToggle: true,
      searchToggle: true,
      pageNo: 1,
      total: null,
      pageSize: null,
      listLoading: false, // 加载圆圈是否显示
      configData: [],
      searchData: { // 查询条件字段
        keyName: null,
        dsType: null
      },
      options: {
        'status': {
          '1': '未审核',
          '2': '审核通过',
          '3': ' 审核未通过'
        }
      }
    }
  },
  methods: {
    // 判断字数提示
    textJug(text) {
      if (text) {
        if (text.length > 11) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    // 保存操作
    saveOperate() {
      console.log(this.updateFormData.validTime)
      saveUpdate('/basic/t00PermissionAudit/audit', this.updateFormData, this.addRules, this.$refs.form).then(() => {
        this.searchOption()
        this.$Message.success('操作成功')
        this.formVisible = false
      })
    },
    handleDelete(row) { // 删除
      this.$confirm('此操作将永久删除该资源, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          keyId: row.keyId
        }
        baseRequest('/basic/keywordInfos/delete', param).then(request => {
          this.searchOption()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    openColumn(row) { // 打开查看
      baseRequest('/basic/t00PermissionAuditValue/selectAuditByTabOrCol', { auditId: row.auditId }).then(response => {
        this.toConfigureData = response.data.item
        this.toConfigure = true
      })
    },
    openAddSqoop(row) { // 打开添加
      this.updateFormData.validTime = ''
      this.updateFormData.auditMsg = ''
      this.updateFormData.status = ''
      this.updateFormData.auditId = row.auditId
      this.$nextTick(_ => {
        this.$refs.form.clearValidate()
      })
      this.operateStatus = 1
      this.formVisible = true
    },
    getDefaultHeight() { // 获取表格高度
      return this.$store.state.app.containHeight - 230
    },
    defaultHeight() { // 获取表格高度
      return this.$store.state.app.containHeight - 150
    },
    searchOption(page) {
      this.listLoading = true
      if (!page) {
        this.pageNo = 1
      }
      this.searchData.pageNo = this.pageNo
      this.searchData.pageSize = this.pageSize
      baseSearch('/basic/t00PermissionAudit/selects', this.searchData).then(response => {
        this.configData = response.data.item
        this.total = response.data.total
        this.pageSize = response.data.pageSize
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
<style lang="scss" scoped>
.dialog-contant-default-addOrUpdate {
  margin-top: 10px;
  padding: 0px;
  border: 0px;
}
.dialog-contant-default-addOrUpdate {
  .baseUpdate-form {
    margin-left: calc(50% - 150px);
    .form-input {
      width: 200px;
    }
  }
}
</style>