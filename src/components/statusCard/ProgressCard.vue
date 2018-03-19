<template>
  <div class="agileTrackerProgressCard">
    <el-card class="box-card">
      <div slot="header" class="clearfix" v-if="showhead">
        <span>Progress</span>
        <el-button style="float: right; padding: 3px 0" type="text"></el-button>
      </div>
      <el-row class="cardContentRow">
        <el-col :span="24"><div class="grid-content totalTitle">
          <breakdown-chart :sprintid="sprintid" :chartwidth="chartwidth" :chartheight="chartheight"></breakdown-chart>
        </div></el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import breakDownChart from '@/components/admin-breakdownlayer/breakDownChart';
export default {
  props: {
    sprintid: {
      type: String,
      default: '5aa771aa565aac21dbe670d1'
    },
    showhead: {
      type: Boolean,
      default: false
    },
    chartwidth: {
      type: Number,
      default: 200
    },
    chartheight: {
      type: Number,
      default: 220
    }
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
  },
  created: function () {

  },
  mounted: function () {
    if (this.$root.eventHub) {
      this.$root.eventHub.$emit('getBreakDownChart', this.sprintid, this.chartwidth, this.chartheight);
    }
  },
  watch: {
  },
  components: {
    'breakdown-chart': breakDownChart
  }
};
</script>
<style scoped>
.agileTrackerPlanningCard {
  width: 100%;
}
.cardContentRow {
  line-height: 50px;
  align-items: center;
  margin-left: -20px;
  margin-right: -20px;
  border-top: 1px solid #DCDFE6;
}
.cardContentRow:first-child {
  margin-top: -20px;
}
.cardContentRow:last-child {
  margin-bottom: -20px;
}
.totalTitle,
.daysTitle {
}
.totalTitle {
}
.daysTitle {
  background-color: #67C23A;
}
</style>
