<template>
  <div class="agileTrackerDoneCard">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="position:relative;">
        <span style="border: 1px solid white;position:absolute;top: -20px; left: -20px;border-radius: 5px;background-color: #303133;color:white;padding-left:10px;padding-right:10px;padding-top:1px;">CDP</span>
        <el-dropdown style="float: left; padding: 3px 0;">
          <span class="el-dropdown-link" style="position:relative;top: 5px;color:white;">
            Actions<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>View Detail</el-dropdown-item>
            <el-dropdown-item>Edit Sprint</el-dropdown-item>
            <el-dropdown-item>ReOpen To Planning</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>b1805 - Sprint 2</span>
      </div>
      <el-row class="cardRow">
        <el-col :span="24" class="firstColumn">
          <el-row class="leftContentRow">
            <el-col :span="12">
              From: 2018-3-1
            </el-col>
            <el-col :span="12">
              To: 2018-4-1
            </el-col>
          </el-row>
          <el-row class="leftContentRow">
            <el-col :span="14"><div class="grid-content totalTitle">Points Done</div></el-col>
            <el-col :span="10"><div class="grid-content">68</div></el-col>
          </el-row>
          <el-row class="leftContentRow">
            <el-col :span="14"><div class="grid-content daysTitle">Total Days</div></el-col>
            <el-col :span="10"><div class="grid-content">27</div></el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import estimationChart from '../admin-common/estimationChartLight.vue';
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
      estimate: 15
    };
  },
  methods: {
    fetchData () {
      var that = this;
      if (!window.localStorage.getItem('module') || !window.localStorage.getItem('sprint')) {
        return false;
      }
      that.resize();
      this.axios.get('/admin/planning?module=' + this.module + '&sprintid=' + this.sprintid).then((response) => {
        if (response.data.status === 'success') {
          that.sprintinfo = response.data.resData;
          that.sprintinfo.totalpoints = response.data.totalPoints;
          that.$refs.estimationChartRef.fetchData('', that.sprintinfo);

          that.resize();
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
          message: 'Data error!',
          type: 'error'
        });
      });
    },
    resize: function () {
      var width = $(this.$refs.estimationChartRef.$el).width();
      var height = $(this.$refs.estimationChartRef.$el).width() * 0.6;
      this.$refs.estimationChartRef.myChart.resize({width: width, height: height});
      $(this.$refs.estimationChartRef.$el).height(height);
      $('#estimationChartLight').height(height);
      var rows = $(this.$el).find('.firstColumn>div');
      var columnHeight = $(this.$el).height() - 60;
      columnHeight = columnHeight - $(rows[0]).height();
      var calculatedHeight = columnHeight / 2 - 3;
      $(rows[1]).height(calculatedHeight).find('.grid-content').height(calculatedHeight).css('line-height', (calculatedHeight) + 'px');
      $(rows[2]).height(calculatedHeight).find('.grid-content').height(calculatedHeight).css('line-height', (calculatedHeight) + 'px');
    }
  },
  created: function () {
  },
  mounted: function () {
  },
  watch: {
  },
  components: {
    'estimationChart': estimationChart
  }
};
</script>
<style scoped>
.agileTrackerDoneCard {
  width: 300px;
  padding-top: 20px;
}
.cardRow {
  align-items: center;
  margin-left: -20px;
  margin-right: -20px;
}
.leftContentRow {
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #DCDFE6;
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
