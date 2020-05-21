<template>
    <div>
        <el-table height="370px" stripe :data="languageData">
            <el-table-column align="center" label="语言" prop="msgLocale"></el-table-column>
            <el-table-column align="center" label="信息">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.msgText" style="width:155px;"></el-input>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
  props: {
    languageData: Array
  }
}
</script>

