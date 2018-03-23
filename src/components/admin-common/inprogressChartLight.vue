
<template>
  <div>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <el-row :gutter="2">
        <el-col :span="22">
          <div id="inprogressChartLight" style=""></div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  var echarts = require('echarts/lib/echarts');
  require('echarts');

  export default {
    data () {
      return {
        popupTitle: 'Story List',
        showPopup: false
      };
    },
    methods: {
      createChart: function () {
        var that = this;
        if (!this.myChart) {
          this.myChart = echarts.init(document.getElementById('inprogressChartLight'));
          this.myChart.on('click', function (params) {
            if (params.type === 'click' && params.seriesType === 'bar') {
              that.showPopup = true;
            }
          });
          this.myChart.setOption(
            {
              title: {
                text: 'Inprogress Overview'
              },
              tooltip: {
                show: true,
                trigger: 'item'
              },
              legend: {
                show: false,
                data: ['Points', 'Count']
              },
              toolbox: {
                show: false,
                feature: {
                  mark: {show: true},
                  dataView: {show: true, readOnly: false},
                  magicType: {show: true, type: ['bar']},
                  restore: {show: true},
                  saveAsImage: {show: true}
                }
              },
              calculable: true,
              yAxis: {
                type: 'value',
                name: 'Points/Count',
                axisLabel: {
                  formatter: '{value}'
                }
              },
              xAxis: {
                show: false,
                type: 'category',
                data: [],
                axisLabel: {
                  interval: 0
                }
              },
              series: [
                {
                  name: 'Points',
                  type: 'bar',
                  itemStyle: {
                    normal: {
                      borderRadius: 5,
                      color: 'rgb(230, 162, 60)',
                      label: {
                        show: true,
                        textStyle: {
                          fontSize: '20',
                          fontFamily: '微软雅黑',
                          fontWeight: 'bold'
                        }
                      }
                    }
                  },
                  data: []
                },
                {
                  name: 'Count',
                  type: 'bar',
                  itemStyle: {
                    normal: {
                      borderRadius: 5,
                      color: 'rgb(64, 158, 255)',
                      label: {
                        show: true,
                        textStyle: {
                          fontSize: '20',
                          fontFamily: '微软雅黑',
                          fontWeight: 'bold'
                        }
                      }
                    }
                  },
                  data: []
                }
              ]
            });
        }
      },
      setData: function (originalData) {
        this.createChart();
        var xAxis = ['Open&Inprogress', 'Commited', 'Done', 'Initial Commited'];
        var pointsArr = [{
          value: originalData.inprogresspoints,
          name: 'Total',
          list: originalData.inprogresstories
        }, {
          value: originalData.commitedpoints,
          name: 'Commited',
          list: originalData.commitedstories
        }, {
          value: originalData.donepoints,
          name: 'Done',
          list: originalData.donestories
        }, {
          value: originalData.initialcommited,
          name: 'Initial Commited',
          list: originalData.initialcommitedstories
        }];
        var countArr = [{
          value: originalData.inprogresstories.length,
          list: originalData.inprogresstories
        }, {
          value: originalData.commitedstories.length,
          list: originalData.commitedstories
        }, {
          value: originalData.donestories.length,
          list: originalData.donestories
        }, {
          value: originalData.initialcommitedstories.length,
          list: originalData.initialcommitedstories
        }];
        this.myChart.setOption({
          xAxis: {
            type: 'category',
            data: xAxis,
            axisLabel: {
              interval: 0
            }
          },
          series: [
            {
              name: 'Points',
              type: 'bar',
              data: pointsArr,
              itemStyle: {
                normal: {
                  borderRadius: 5,
                  color: '#E6A23C',
                  label: {
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontFamily: '微软雅黑',
                      fontWeight: 'bold'
                    }
                  }
                }
              }
            },
            {
              name: 'Count',
              type: 'bar',
              itemStyle: {
                normal: {
                  borderRadius: 5,
                  color: '#67C23A',
                  label: {
                    show: true,
                    textStyle: {
                      fontSize: '20',
                      fontFamily: '微软雅黑',
                      fontWeight: 'bold'
                    }
                  }
                }
              },
              data: countArr
            }
          ]
        });
      }
    }
  };
</script>