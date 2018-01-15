
<template>
  <div>
    <el-card class="box-card">
      <div id="mainChart" style="height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  var echarts = require('echarts/lib/echarts');
  require('echarts');
  require('echarts/lib/component/title');
  require('echarts/lib/chart/line');

  export default {
    props: ['sprintsData'],
    watch: {
      'sprintsData': 'setData'
    },
    mounted () {
      this.myChart = echarts.init(document.getElementById('mainChart'));
      this.myChart.setOption(
        {
          title: {
            text: 'Sprint Points Review'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['Planned', 'Done'],
            show: true,
            left: 'center'
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {readOnly: false},
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.sprintsData.axis
          },
          yAxis: {
            type: 'value',
            name: 'Points',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: [
            {
              name: 'Planned',
              type: 'line',
              data: this.sprintsData.planned,
              itemStyle: {
                normal: {
                  color: '#67C23A'
                }
              }
            },
            {
              name: 'Done',
              type: 'line',
              data: this.sprintsData.done
            }
          ]
        });
    },
    methods: {
      setData: function (data) {
        console.log('start');
        this.myChart.setOption({
          series: [
            {
              name: 'Planned',
              type: 'line',
              data: this.sprintsData.planned,
              itemStyle: {
                normal: {
                  color: '#67C23A'
                }
              }
            },
            {
              name: 'Done',
              type: 'line',
              data: this.sprintsData.done
            }
          ],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.sprintsData.axis
          }
        });
      }
    }
  };
</script>