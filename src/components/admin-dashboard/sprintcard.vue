<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="font">Current Sprint</span>
      </div>
      <el-form inline label-position="left" class="demo-table-expand">
        <el-form-item label="Release:">
          <span>{{cardInfo.release}}</span>
        </el-form-item>
        <el-form-item label="Sprint:">
          <span>{{cardInfo.sprint}}</span>
        </el-form-item>
        <el-form-item label="Start:">
          <span>{{cardInfo.start}}</span>
        </el-form-item>
        <el-form-item label="End:">
          <span>{{cardInfo.end}}</span>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        cardInfo: {}
      };
    },
    created: function () {
      this.fetchData();
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      fetchData () {
        var that = this;
        this.axios.get('/admin/sprint/latest').then((response) => {
          if (response.data.status === 'success') {
            that.cardInfo = response.data.resData || {};
          } else {
            that.$message({
              message: response.data.resMsg,
              type: response.data.status
            });
          }
        })
        .catch((err) => {
          console.log(err);
          that.$message({
            message: '数据获取失败！',
            type: 'error'
          });
        });
      }
    }
  };
</script>

<style scoped>
  .font{
    color: #409EFF;
    size: 16px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: bold;
  }

</style>