/*
  author: onwebbe (tai)
*/

<template>
  <div class="mainPage">
    <div class="toDashboard">
      <el-button type="primary" plain icon="el-icon-menu" @click="toDashbord">Dashboard</el-button>
    </div>
    <el-container>
      <el-header>
        Agile Workflow
      </el-header>
      <el-container>
        <el-main>
          <div class="chart">
          </div>
        </el-main>
        <el-aside width="25%">
          <router-view></router-view>
        </el-aside>
      </el-container>
      <el-footer>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import VUEChart from '@/chartjs/VUEChart.js';

export default {
  name: 'ChartMainPage',
  data () {
    return {
      chart: null,
      allPoints: [],
      allLines: [],
      allData: null
    };
  },
  methods: {
    getLatestSummaryData: function () {
      var allGroups = this.$root.sprintSelected.sprintgroups;
      var allSummaryLength = this.allData.summary.length;
      var latestDay = allSummaryLength - 1;
      var previousDay = latestDay - 1;
      if (previousDay < 0) {
        previousDay = 0;
      }
      if (latestDay >= 0) {
        var todayData = this.getSummaryByDate(latestDay);
        var previousDayData = this.getSummaryByDate(previousDay);
        var clickedGroup = '';
        for (var i = 0; i < allGroups.length; i++) {
          var groupItem = allGroups[i];
          clickedGroup = groupItem.groupname;
        }
        var day = latestDay;
        if (this.$root.eventHub) {
          this.$root.eventHub.$emit('getDaySummary', day, clickedGroup, todayData, previousDayData);
        }
      }
    },
    getSummaryByDate: function (date) {
      var summarys = this.allData.summary;
      var returnSummary = null;
      for (var i = 0; i < summarys.length; i++) {
        var summaryItem = summarys[i];
        var day = summaryItem.day;
        if (day === date) {
          returnSummary = summaryItem;
          break;
        }
      }
      return returnSummary;
    },
    updateData: function (response) {
      this.allData = response.resData;
      var summary = response.resData.summary;
      var constances = response.resData.constances;
      var initialPoints = response.resData.initialPoints;
      var issueResovledStatus = response.resData.constances.storyIssueResovledStatus;
      var dataByGroup = {};
      var groupIndex = 0;
      for (let group in initialPoints) {
        this.addNewGroup(group, groupIndex);
        groupIndex++;
      }
      for (var i = 0; i < summary.length; i++) {
        var summ = summary[i];
        var day = summ.day;
        let groups = summ.groups;
        for (let groupid in groups) {
          var groupObj = groups[groupid];
          if (dataByGroup[groupid] == null) {
            dataByGroup[groupid] = {};
          }
          dataByGroup[groupid]['day'] = day;
          dataByGroup[groupid]['blocker'] = groupObj['blocker'];
          dataByGroup[groupid]['followup'] = groupObj['followup'];
          dataByGroup[groupid]['point'] = groupObj.points;

          initialPoints[groupid] = initialPoints[groupid] - groupObj['points']['red'];
          this.allPoints.push(this.chart.addPoint(i, initialPoints[groupid], groupid, {type: 'red', group: groupid, summarydata: summ, constances: constances}));

          if (groupObj['points']['add'] > 0) {
            initialPoints[groupid] = initialPoints[groupid] + groupObj['points']['add'];
            this.allPoints.push(this.chart.addPoint(i, initialPoints[groupid], groupid, {type: 'add', group: groupid, summarydata: summ, constances: constances}));
          }
        }
      }
      var lines = [];
      this.chart.renderBar();
      this.chart.reScaleChart();
      for (let group in initialPoints) {
        lines = this.chart.addAllLine(group);
      }
      for (i = 0; i < lines.length; i++) {
        var line = lines[i];
        var lineEndPoint = line.endPoint;
        let groups = lineEndPoint.extraData.summarydata.groups;
        var ifLineBlock = false;
        for (let groupid in groups) {
          var groupItem = groups[groupid];
          var groupBlocker = groupItem.blocker;
          if (groupBlocker != null && groupBlocker.length > 0) {
            for (var j = 0; j < groupBlocker.length; j++) {
              var groupBlockerItem = groupBlocker[j];
              console.log(groupBlockerItem);
              if (groupBlockerItem.status !== issueResovledStatus) {
                console.log('we have block issue at sprint day:' + i);
                ifLineBlock = true;
                break;
              }
            }
          }
        }
        if (ifLineBlock) {
          line.ele.css('border-bottom', '1px solid red');
        }
      }
      this.getLatestSummaryData();
    },
    addNewGroup: function (groupname, index) {
      var i = 0;
      var selectedColor = null;
      for (var color in VUEChart.colors) {
        if (i === index) {
          selectedColor = VUEChart.colors[color];
          break;
        }
        i++;
      }
      this.chart.addGroup(groupname, {color: selectedColor});
    },
    toDashbord: function () {
      window.location.href = '/admin#/dashboard';
    }
  },
  created: function () {
    if (this.$root.eventHub) {
      this.$root.eventHub.$on('sprintChanged', this.updateData);
    }
  },
  mounted: function () {
    var self = this;
    let chart = new VUEChart('.chart', 1000, 500);
    chart.addEventListener('pointclicked', function (evt) {
      chart.clearAllClickedPoint();
      let todayData = evt.data.data.extraData.summarydata;
      let day = evt.data.data.extraData.summarydata.day;
      let previousDay = (day === 0 ? 0 : day - 1);
      let previousData = self.getSummaryByDate(previousDay);
      let clickedGroup = evt.data.data.extraData.group;
      let type = evt.data.data.extraData.type;
      let isClicked = evt.data.isClicked;
      if (isClicked) {
        if (self.$root.eventHub) {
          self.$root.eventHub.$emit('getDaySummary', day, clickedGroup, todayData, previousData, type);
        }
      } else {
        self.getLatestSummaryData();
      }
    });
    chart.addEventListener('chartClicked', function (evt) {
      self.getLatestSummaryData();
    });
    chart.addEventListener('pointhoverenter', function (evt) {
      let constances = evt.data.pointdata.constances;
      let clickedGroup = evt.data.pointdata.group;
      let point = evt.data.point.y;
      var day = evt.data.point.x;
      let x = evt.data.point.positionX;
      let y = evt.data.point.positionY;
      let blocker = evt.data.pointdata.summarydata.groups[clickedGroup]['blocker'];
      let blockerCount = 0;
      if (blocker != null) {
        for (let i = 0; i < blocker.length; i++) {
          let blockerItem = blocker[i];
          if (blockerItem.status !== constances.storyIssueResovledStatus) {
            blockerCount++;
          }
        }
      }

      let followup = evt.data.pointdata.summarydata.groups[clickedGroup]['followup'];
      let followupCount = 0;
      if (followup != null) {
        for (let i = 0; i < followup.length; i++) {
          let followupItem = followup[i];
          if (followupItem.status !== constances.storyIssueResovledStatus) {
            followupCount++;
          }
        }
      }
      let displayContent = '<div>Day ' + day + ': ' + clickedGroup + '</div><div>Point: ' + point + '</div><div>Blocker: ' + blockerCount + '&nbsp;&nbsp;Followup: ' + followupCount + '</div>';
      console.log(displayContent);
      chart.displayPopover(x, y, displayContent);
    });
    chart.addEventListener('pointhoverleave', function (evt) {
      console.log('hide');
      chart.hidePopover();
    });
    /* chart.addGroup('null', {color: 'green'});
    chart.addPoint(0, 10, 'null');
    chart.renderBar(); */
    this.chart = chart;
  },
  components: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
aside {
  min-width: 400px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.toDashboard {
  text-align: right;
  padding: 0px 20px;
}
</style>
