/*
 * @Author: lk 
 * @Date: 2019-02-14 10:21:28 
 * @Last Modified by: 1k
 * @Last Modified time: 2019-09-27 17:14:39
 * @Description:  公告管理
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
        <template slot="firstColumn">
          <el-table-column fixed="left"
                           width="150"
                           label="标题"
                           align="center">
            <template slot-scope="scope">
              <el-button type="text"
                         size="mini"
                         @click="seeView(scope.row)">{{scope.row.noticeTitle}}</el-button>
            </template>
          </el-table-column>
        </template>
        <template slot="optionColumn">
          <el-table-column fixed="right"
                           width="240"
                           label="操作"
                           align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.status === '1'">
                <el-button type="primary"
                           plain
                           size="mini"
                           @click="updateOption(scope.row)">修改</el-button>
                <el-button type="success"
                           plain
                           size="mini"
                           @click="release(scope.row)">发布</el-button>
                <el-button type="danger"
                           plain
                           size="mini"
                           @click="handleDelete(scope.row)">删除</el-button>
              </div>
              <div v-if="scope.row.status === '2'">
                <el-button type="warning"
                           plain
                           size="mini"
                           @click="cancelPublish(scope.row)">取消发布</el-button>
              </div>
              <div v-if="scope.row.status === '3'">
                <el-button type="info"
                           plain
                           size="mini"
                           @click="seeViewLog(scope.row)">查看记录</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </basic-table>
    </div>
    <el-dialog :title="dialogTitle[operateStatus]"
               v-el-drag-dialog
               :close-on-click-modal='true'
               :visible.sync="formVisible"
               width="78%"
               custom-class="dialog-default">
      <div class="dialog-contant-default notice">
        <el-form v-if="formVisible && operateStatus!==5"
                 v-loading="downloadLoading"
                 ref="formUpdate"
                 :model="newsItem"
                 style="padding:30px"
                 label-suffix=""
                 label-width="80px">
          <el-form-item v-show="false">
            <el-input :disabled="operateStatus===3"
                      v-model="newsItem.noticeId"></el-input>
          </el-form-item>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="标题:"
                            prop="noticeTitle"
                            :rules="{required:true,message:'标题不能为空'}">
                <el-input :disabled="operateStatus===3"
                          clearable
                          v-model="newsItem.noticeTitle"
                          style="width: 250px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="概述:">
                <el-input :disabled="operateStatus===3"
                          clearable
                          v-model="newsItem.summary"
                          style="width: 250px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="正文">
            <tinymce :noRead="operateStatus===3?1:0"
                     :height="300"
                     v-model="newsItem.content"></tinymce>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload class="upload-demo"
                       :disabled="operateStatus===3"
                       multiple
                       ref="upload"
                       :file-list="fileList"
                       :on-remove="handleRemove"
                       :action="uploadUrl"
                       :on-preview="downloadHandle"
                       :http-request="uploadRequest">
              <el-button v-if="operateStatus!==3"
                         size="small"
                         type="primary">点击上传</el-button>
              <!-- <div slot="tip" class="el-upload__tip">文件不能超过500kb</div> -->
            </el-upload>
          </el-form-item>
        </el-form>
        <view-log v-if="formVisible && operateStatus === 5"
                  :viewLog="viewLog"></view-log>
      </div>

      <div v-if="operateStatus !== 5"
           slot="footer"
           class="dialog-footer">
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="saveOperate()">保存</el-button>
      </div>
      <div v-else
           slot="footer"
           class="dialog-footer">
        <el-button @click="formVisible = false">关闭</el-button>
      </div>
    </el-dialog>
    <release-form ref="releaseForm"
                  @searchOption="searchOption"></release-form>
  </div>
</template>
<script>
import SearchForm from 'search-form-ry'
import BasicTable from 'basic-table-ry'
import UpdateForm from 'update-form-ry'
import Tinymce from '@/components/Tinymce'
import { getSearchParam } from '@/utils/index'
import { baseRequest, baseUpload } from '@/api/base'
import ReleaseForm from './conponents/ReleaseForm'
import ViewLog from './conponents/ViewLog'
const url = '/basic/notices/selects'
const uploadUrl = `${process.env.BASE_API}/basic/notices/upload`
import { download } from '@/utils/download'
export default {
  name: 'announcementIndex',
  components: {
    SearchForm,
    BasicTable,
    UpdateForm,
    Tinymce,
    ViewLog,
    ReleaseForm
  },
  data() {
    return {
      configData: {}, // 模板数据
      searchToggle: true,
      tableToggle: true,
      formVisible: false, // 弹框开关
      operateStatus: null, // 操作选项
      dialogTitle: {
        // 弹框标题
        1: '添加',
        2: '修改',
        3: '查看',
        4: '发布',
        5: '查看记录'
      },
      uploadUrl: uploadUrl,
      fileList: [], // 上传文件列表
      newsItem: { // 添加修改表单数据
        noticeId: null, noticeTitle: null, summary: null, content: null
      },
      viewLog: {// 查看记录用
        noticeId: null,
        publishType: null
      },
      downloadLoading: false
    }
  },
  created() {
    this.getOption()
  },
  methods: {
    searchOption() {
      this.$refs.basicTable.getData(url, this.$refs.searchForm.searchParam())
    },
    getOption() {
      baseRequest(url, { 'urlMode': '1' }).then(response => {
        const result = response.data
        result.formConfig = JSON.parse(result.formConfig)
        result.tableConfig = JSON.parse(result.tableConfig)
        this.configData = result
        const param = getSearchParam(result.formConfig)
        this.$refs.basicTable.getData(url, param)
      })
    },
    // 资源删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = { noticeId: row.noticeId }
        baseRequest('/basic/notices/delete', param).then(request => {
          this.searchOption()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    // 点击添加
    addOption() {
      this.operateStatus = 1
      this.formVisible = true
      for (const key in this.newsItem) {
        this.newsItem[key] = null
      }
      this.fileList = []
    },
    // 修改表单
    updateOption(row) {
      this.operateStatus = 2
      for (const key in this.newsItem) {
        if (row.hasOwnProperty(key)) {
          this.newsItem[key] = row[key]
        } else {
          this.newsItem[key] = null
        }
      }
      this.fileList = []
      baseRequest('/basic/notices/getFileList', { relationId: row.noticeId }).then(response => {
        const list = response.data.item
        for (const iterator of list) {
          const item = {}
          item.name = iterator.file_name
          item.id = iterator.file_id
          this.fileList.push(item)
        }
        this.formVisible = true
      })
    },
    // 查看
    seeView(row) {
      this.updateOption(row)
      this.operateStatus = 3
    },
    // 发布
    release(row) {
      this.$refs.releaseForm.release(row)
    },
    // 取消发布
    cancelPublish(row) {
      this.$confirm('确定取消发布吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = { noticeId: row.noticeId }
        baseRequest('/basic/notices/cancelPublish', param).then(request => {
          this.searchOption()
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
      })
    },
    // 查看记录
    seeViewLog(row) {
      this.operateStatus = 5
      this.formVisible = true
      this.viewLog.noticeId = row.noticeId
      this.viewLog.publishType = row.publishType
    },
    // 获取修改表单
    getUpdateForm(row) {
      baseRequest('/basic/announcement/getOption').then(response => {
        const result = response.data
        this.news = result
      })
    },
    // 保存操作
    saveOperate() {
      this.$refs['formUpdate'].validate((valid) => {
        if (valid) {
          const fileList = { fileList: this.fileList }
          const param = Object.assign(this.newsItem, fileList)
          if (this.operateStatus === 1) {
            baseRequest('/basic/notices/add', param).then(response => {
              this.searchOption()
              this.$Message.success('操作成功')
            })
          } else if (this.operateStatus === 2) {
            baseRequest('/basic/notices/update', param).then(response => {
              this.searchOption()
              this.$Message.success('操作成功')
            })
          }
          this.formVisible = false
        } else { return false }
      })
    },
    // 上传删除
    handleRemove(file, fileList) {
      const index = this.fileList.findIndex((item, index, arr) => {
        return item.id === file.id
      })
      this.fileList.splice(index, 1)
    },
    // 上传文件
    uploadRequest(content) {
      var form = new FormData()
      form.append('file', content.file)
      baseUpload(uploadUrl, form).then((response) => {
        content.onSuccess('文件上传成功！')
        const item = { name: content.file.name, id: response.data.item.fileId }
        this.fileList.push(item)
      })
    },
    // 下载文件
    downloadHandle(file) {
      this.downloadLoading = true
      download('/basic/files/download', { fileId: file.id }, () => {
        this.downloadLoading = false
      }, () => {
        this.downloadLoading = false
      })
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

