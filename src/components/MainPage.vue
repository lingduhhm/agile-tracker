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
    <add-point-dialog></add-point-dialog>
  </div>
</template>

<script>
import VUEChart from '@/chartjs/VUEChart.js';
import AddDialogContent from '@/components/AddPointDialogComponent';

export default {
  name: 'ChartMainPage',
  data () {
    return {
    };
  },
  created: function () {
  },
  mounted: function () {
    let chart = new VUEChart('.chart', 1000, 500);
    chart.addGroup('null', {color: 'green'});
    chart.addPoint(0, 10, 'null');
    chart.renderBar();
  },
  components: {
    'add-point-dialog': AddDialogContent
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
