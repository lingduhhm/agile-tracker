/*
  author: onwebbe (tai)
*/

<template>
  <div class="mainPage">
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
      chart: null
    };
  },
  methods: {
    updateData: function (response) {
      var summary = response.resData.summary;
      var initialPoints = response.resData.initialPoints;
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
          this.chart.addPoint(i, initialPoints[groupid], groupid, summ);

          if (groupObj['points']['add'] > 0) {
            initialPoints[groupid] = initialPoints[groupid] + groupObj['points']['add'];
            this.chart.addPoint(i, initialPoints[groupid], groupid, summ);
          }
        }
      }
      var lines = [];
      this.chart.renderBar();
      this.chart.reScaleChart();
      for (let group in initialPoints) {
        lines = this.chart.addAllLine(group);
      }
      console.log('lines');
      console.log(lines);
      for (i = 0; i < lines.length; i++) {
        var line = lines[i];
        var lineEndPoint = line.endPoint;
        let groups = lineEndPoint.extraData.groups;
        var ifLineBlock = false;
        console.log(lineEndPoint);
        for (let groupid in groups) {
          var groupItem = groups[groupid];
          var groupBlocker = groupItem.blocker;
          if (groupBlocker != null && groupBlocker.length > 0) {
            ifLineBlock = true;
            break;
          }
        }
        if (ifLineBlock) {
          line.ele.css('border-bottom', '1px solid red');
        }
      }
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
    }
  },
  created: function () {
    if (this.$root.eventHub) {
      this.$root.eventHub.$on('sprintChanged', this.updateData);
    }
  },
  mounted: function () {
    let chart = new VUEChart('.chart', 1000, 500);
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
</style>
