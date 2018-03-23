<template>
  <div class="agileTrackerProgressCard">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="position:relative;">
        <span style="border: 1px solid white;position:absolute;top: -20px; left: -20px;border-radius: 5px;background-color: #303133;color:white;padding-left:10px;padding-right:10px;padding-top:1px;">CDP</span>
        <el-row :gutter="5">
          <el-col :span="4">
            <el-dropdown style="float: left; padding: 3px 0;">
              <span class="el-dropdown-link" style="position:relative;top: 5px;color:white;">
                Actions<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>View Detail</el-dropdown-item>
                <el-dropdown-item>Edit Sprint</el-dropdown-item>
                <el-dropdown-item>Close the Sprint</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
          <el-col :span="12" style="text-align:left;">
            <span>b1805 - Sprint 2 (2018-3-1 - 2018-4-1)</span>
          </el-col>
          <el-col :span="4">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
          </el-col>
          <el-col :span="4">
            <font style="font-size: 1.2em;font-weight: bold;">10</font> Days Left
          </el-col>
        </el-row>
      </div>
      <el-row class="cardRow">
        <el-col :span="7" class="firstColumn">
          <el-row class="leftContentRow">
            <el-col :span="12" style="background-color:#67C23A;"><div class="grid-content">Logged: 39h</div></el-col>
            <el-col :span="12" style="background-color:#E6A23C;"><div class="grid-content">Left: 42h</div></el-col>
          </el-row>
          <el-row class="leftContentRow" v-for="tableItem in statusTable" :key="tableItem._id">
            <el-col :span="12"><div class="grid-content">{{tableItem.name}}</div></el-col>
            <el-col :span="12"><div class="grid-content">{{tableItem.count}} / {{tableItem.point}}pt</div></el-col>
          </el-row>
        </el-col>
        <el-col :span="5" class="burnDownChart">
          <burndown-chart :sprintid="sprintid" ref="burnDownChart" :chartwidth="burndownWidth" :chartheight="burndownHeight"></burndown-chart>
        </el-col>
        <el-col :span="5" class="inProgressChart" v-show="false">
          <inprogress-chart ref="inProgressChart"></inprogress-chart>
        </el-col>
        <el-col :span="12" class="workLogChart">
          <worklog-chart ref="workLogChart"></worklog-chart>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import inprogressChart from '../admin-common/inprogressChartLight';
import burnDownChart from '../admin-breakdownlayer/breakDownChart';
import worklogChart from '../admin-common/worklogChartLight';
export default {
  props: {
    module: '',
    sprintid: ''
  },
  data () {
    return {
      total: 28,
      days: 20,
      capacity: 20,
      estimate: 15,
      burndownWidth: 0,
      burndownHeight: 0,
      statusTable: [{
        name: 'Open/InProgress',
        count: 3,
        point: 30,
        color: 'black'
      }, {
        name: 'Commited',
        count: 4,
        point: 70,
        color: 'black'
      }, {
        name: 'Done',
        count: 2,
        point: 20,
        color: 'black'
      }, {
        name: 'Initial/Commit',
        count: 1,
        point: 10,
        color: 'black'
      }]
    };
  },
  methods: {
    fetchData () {
      var that = this;
      if (!window.localStorage.getItem('module') || !window.localStorage.getItem('sprint')) {
        return false;
      }
      this.axios.get('/admin/dashboard?module=' + this.module + '&sprintid=' + this.sprintid).then((response) => {
        if (response.data.status === 'success') {
          var responseData = response.data.resData;
          that.dashboard = responseData;
          that.sprintinfo = responseData.sprintData;
          that.burndownSprintid = that.sprintinfo._id;
          this.$refs.workLogChart.fetchData('', this.sprintinfo);
          this.$refs.inProgressChart.setData(response.data.resData);
          setTimeout(() => {
            that.$root.eventHub.$emit('getBreakDownChart', this.sprintinfo._id);
          });
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
    resize: function () {
      var chartWidth = $(this.$el).find('.burnDownChart').innerWidth();
      var chartHeight = chartWidth;
      $(this.$el).find('.chartsummary').height(chartHeight);
      $(this.$el).find('#inprogressChartLight').height(chartHeight);
      $(this.$el).find('#worklogChartLight').height(chartHeight);
      this.burndownWidth = chartWidth - 80;
      this.burndownHeight = chartHeight - 50;

      var rows = $(this.$el).find('.firstColumn>div');
      var columnHeight = $(this.$el).height() - 70;
      rows.height(columnHeight / rows.length).css('line-height', (columnHeight / rows.length) + 'px');
    }
  },
  created: function () {
  },
  mounted: function () {
    this.resize();
  },
  watch: {
  },
  components: {
    'inprogress-chart': inprogressChart,
    'worklog-chart': worklogChart,
    'burndown-chart': burnDownChart
  }
};
</script>
<style scoped>
.agileTrackerProgressCard {
  width: 100%;
}
.cardRow {
  align-items: center;
  margin-left: -20px;
  margin-right: -20px;
}
.leftContentRow {
  border-top: 1px solid #DCDFE6;
  border-right: 1px solid #DCDFE6;
}
.cardRow:first-child {
  margin-top: -20px;
}
.cardRow:last-child {
  margin-bottom: -20px;
}
.totalTitle,
.daysTitle {
  height: 50px;
}
.totalTitle {
  background-color: #409EFF;
}
.daysTitle {
  background-color: #67C23A;
}
</style>
