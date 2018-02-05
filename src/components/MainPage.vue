/*
  author: onwebbe (tai)
*/

<template>
  <div class="mainPage">
    <div class="toDashboard">     
      <el-button type="success" plain icon="el-icon-edit" @click="openDialog">Change Sprint</el-button>
      <el-button type="primary" plain icon="el-icon-menu" @click="toDashbord">Dashboard</el-button>
      <sprint-select-dialog :dialogDisplay="dialogDisplay"></sprint-select-dialog>
    </div>
    <el-container>
      <el-header>
        <h1 class="title">
        Agile Workflow ({{module}} - {{sprint}})
        </h1>
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
import SprintDialogContent from '@/components/SprintSelectComponent';

export default {
  name: 'ChartMainPage',
  data () {
    return {
      dialogDisplay: false,
      chart: null,
      allPoints: [],
      allLines: [],
      allData: null,
      module: '',
      sprint: ''
    };
  },
  methods: {
    openDialog: function () {
      this.dialogDisplay = true;
      var self = this;
      setTimeout(function () {
        self.dialogDisplay = null;
      });
    },
    sprintSelected: function (sprintSelected) {
      let sprintName = sprintSelected.release + ' Sprint ' + sprintSelected.sprint;
      this.module = sprintSelected.module;
      this.sprint = sprintName;
    },
    getLatestSummaryData: function () {
      // var allGroups = this.$root.sprintSelected.sprintgroups;
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
        /* for (var i = 0; i < allGroups.length; i++) {
          var groupItem = allGroups[i];
          clickedGroup = groupItem.groupname;
        } */
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
      this.chart.emptyData();
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
          var currentPoint = groupObj.currentPoint;

          this.allPoints.push(this.chart.addPoint(i, currentPoint, groupid, {type: 'all', group: groupid, summarydata: summ, constances: constances}));

          // if (i === 0) {
          //   initialPoints[groupid] = initialPoints[groupid] - groupObj['points']['red'];
          //   initialPoints[groupid] = initialPoints[groupid] + groupObj['points']['add'];
          //   this.allPoints.push(this.chart.addPoint(i, initialPoints[groupid], groupid, {type: 'add', group: groupid, summarydata: summ, constances: constances}));
          // } else {
          //   initialPoints[groupid] = initialPoints[groupid] - groupObj['points']['red'];
          //   this.allPoints.push(this.chart.addPoint(i, initialPoints[groupid], groupid, {type: 'red', group: groupid, summarydata: summ, constances: constances}));

          //   if (groupObj['points']['add'] > 0) {
          //     initialPoints[groupid] = initialPoints[groupid] + groupObj['points']['add'];
          //     this.allPoints.push(this.chart.addPoint(i, initialPoints[groupid], groupid, {type: 'add', group: groupid, summarydata: summ, constances: constances}));
          //   }
          // }
        }
      }
      this.chart.renderBar();
      this.chart.reScaleChart();
      this.chart.reAddAllGroupLine();
      var linesGroup = this.chart.getGroupsData();
      var lines = [];
      for (let group in linesGroup) {
        lines = lines.concat(linesGroup[group].lines);
      }
      for (i = 0; i < lines.length; i++) {
        var line = lines[i];
        var lineEndPoint = line.endPoint;
        let groups = lineEndPoint.extraData.summarydata.groups;
        var ifLineBlock = false;
        for (let groupid in groups) {
          let groupItem = groups[groupid];
          var groupBlocker = groupItem.blocker;
          if (groupBlocker != null && groupBlocker.length > 0) {
            for (let j = 0; j < groupBlocker.length; j++) {
              var groupBlockerItem = groupBlocker[j];
              if (groupBlockerItem.status !== issueResovledStatus && lineEndPoint.extraData.group === groupid) {
                console.log('we have block issue at sprint day:' + i);
                ifLineBlock = true;
                break;
              }
            }
          }
        }

        var ifLineFollowup = false;
        for (let groupid in groups) {
          let groupItem = groups[groupid];
          var groupFollowup = groupItem.followup;
          if (groupFollowup != null && groupFollowup.length > 0) {
            for (let j = 0; j < groupFollowup.length; j++) {
              var groupFollowupItem = groupFollowup[j];
              if (groupFollowupItem.status !== issueResovledStatus && lineEndPoint.extraData.group === groupid) {
                console.log('we have followup issue at sprint day:' + i);
                ifLineFollowup = true;
                break;
              }
            }
          }
        }

        if (ifLineBlock) {
          let left = parseInt(line.ele.css('left')) + 1;
          let top = parseInt(line.ele.css('top')) - 1;
          line.ele.css('left', left + 'px');
          line.ele.css('top', top + 'px');
          line.ele.css('border-top', '2px solid red');
        }
        if (ifLineFollowup) {
          let left = parseInt(line.ele.css('left')) + 1;
          let top = parseInt(line.ele.css('top')) - 1;
          line.ele.css('left', left + 'px');
          line.ele.css('top', top + 'px');
          line.ele.css('border-bottom', '2px solid #F7931E');
        }
      }

      this.chart.reRenderGroupVisible();
      this.getLatestSummaryData();
      this.chart.reActivePoint();
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
      window.location.href = '/#/admin/home';
    },
    prepareChart: function () {
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
    }
  },
  created: function () {
    if (this.$root.eventHub) {
      this.$root.eventHub.$on('sprintChanged', this.updateData);
      this.$root.eventHub.$on('sprintSelected', this.sprintSelected);
    }
  },
  mounted: function () {
    this.prepareChart();
  },
  components: {
    'sprint-select-dialog': SprintDialogContent
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
