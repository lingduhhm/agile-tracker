
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
    created: function () {
      this.fetchData();
    },
    mounted () {
      this.myChart = echarts.init(document.getElementById('mainChart'));
      this.myChart.setOption(
        {
          title: {
            text: 'Sprint History Review'
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
            data: []
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
              data: [],
              itemStyle: {
                normal: {
                  color: '#67C23A'
                }
              }
            },
            {
              name: 'Done',
              type: 'line',
              data: []
            }
          ]
        });
    },
    methods: {
      fetchData () {
        var that = this;
        this.axios.get('/admin/dashboard/sprintHistoryPoints?module=' + this.$root.module).then((response) => {
          if (response.data.status === 'success') {
            var responseData = response.data.resData;
            that.setData(responseData);
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
      setData: function (data) {
        this.myChart.setOption({
          series: [
            {
              name: 'Planned',
              type: 'line',
              data: data.planned,
              itemStyle: {
                normal: {
                  color: '#67C23A'
                }
              }
            },
            {
              name: 'Done',
              type: 'line',
              data: data.done
            }
          ],
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.axis
          }
        });
      }
    }
  };
</script>