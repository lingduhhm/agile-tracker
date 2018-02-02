<template>
  <div>
    <el-container>
      <el-aside width="300px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="font">Current Sprint</span>
                <el-button v-if="sprintinfo.status != 'done'" style="float: right; padding: 3px 0" type="text" @click="refreshData">Refresh</el-button>
              </div>
              <el-form inline label-position="left" class="demo-table-expand">
                <el-form-item label="Release:">
                  <span>{{dashboard.sprintData && dashboard.sprintData.release}}</span>
                </el-form-item>
                <el-form-item label="Sprint:">
                  <span>{{dashboard.sprintData && dashboard.sprintData.sprint}}</span>
                </el-form-item>
                <el-form-item label="Start:">
                  <span>{{dashboard.sprintData && dashboard.sprintData.start}}</span>
                </el-form-item>
                <el-form-item label="End:">
                  <span>{{dashboard.sprintData && dashboard.sprintData.end}}</span>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-aside>
      <el-main style="padding: 0 20px;">
        <el-row :gutter="20" class="rowMargin">
          <el-col :span="12">
            <number-card label="Total Points" :value="dashboard.totalpoints" unit="points" bkcolor="#409EFF"></number-card>
          </el-col>
          <el-col :span="12">
            <number-card label="Left Days" :value="dashboard.leftdays" unit="days" bkcolor="#F56C6C"></number-card>
          </el-col>

        </el-row>

        <el-row :gutter="20" class="rowMargin">
          <el-col :span="12">
            <number-card label="Commited" :value="dashboard.commitedpoints" unit="points" bkcolor="#67C23A"></number-card>
          </el-col>

          <el-col :span="12">
            <number-card label="Done" :value="dashboard.donepoints" unit="points" bkcolor="#E6A23C"></number-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-row :gutter="20" class="rowMargin">
      <el-col :span="24">
        <worklog-chart ref="worklogChartRef"></worklog-chart>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="rowMargin">
      <el-col :span="24">
        <line-chart ref="historyChartRef"></line-chart>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import numberCard from '../admin-common/numberCard.vue';
  import lineChart from '../admin-common/historyChart.vue';
  import worklogChart from '../admin-common/worklogChart.vue';

  export default {
    data () {
      return {
        sprintinfo: '',
        dashboard: {
          sprintData: {},
          pastdays: 0
        }
      };
    },
    mounted: function () {
      this.fetchData();
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      fetchData () {
        var that = this;
        if (this.$route.params.sprintid === 'undefined') {
          return false;
        }
        this.axios.get('/admin/dashboard?module=' + this.$root.module + '&sprintid=' + this.$route.params.sprintid).then((response) => {
          if (response.data.status === 'success') {
            var responseData = response.data.resData;
            that.dashboard = responseData;
            that.sprintinfo = responseData.sprintData;
            this.$refs.worklogChartRef.fetchData('', this.sprintinfo);
            this.$refs.historyChartRef.fetchData('', this.sprintinfo);
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
      },
      refreshData: function () {
        this.$refs.worklogChartRef.refresh(this.sprintinfo);
      }
    },
    components: {
      'numberCard': numberCard,
      'lineChart': lineChart,
      'worklogChart': worklogChart
    }
  };
</script>

<style scoped>
  .rowMargin{
    margin: 0 0 20px 0;
  }

</style>