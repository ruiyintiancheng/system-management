/*
 * @Author: lk 
 * @Date: 2019-07-22 11:31:40 
 * @Last Modified by: lk
 * @Last Modified time: 2019-07-22 11:43:48
 * @Description:  表关系列表
 */
<template>
    <div class="relation-table" :style="{height:chartHeight+'px'}">
        表关系列表
    </div>
</template>
<script>
export default {
  computed: {
    chartHeight: function() {
      return this.$store.state.app.dialogHeight - 160
    }
  }
}
</script>
