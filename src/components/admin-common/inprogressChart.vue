
<template>
  <div>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <el-row :gutter="2">
        <el-col :span="16">
          <div id="inprogressChart" style="height:233px;"></div>
        </el-col>
        <el-col :span="8">
         <div id="inprogressPie" style="height:233px;"></div>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :title="popupTitle" :visible.sync="showPopup">
      <el-table :data="tableData" max-height="800" border>
        <el-table-column sortable v-for="item in tableColumns" align="left" :key="item.key" :formatter="item.formatter" :prop="item.key" :label="item.label">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  var echarts = require('echarts/lib/echarts');
  require('echarts');

  export default {
    data () {
      return {
        popupTitle: 'Story List',
        showPopup: false,
        tableData: [],
        tableColumns: [{
          label: 'Owner',
          key: 'assignee'
        }, {
          label: 'Key',
          key: 'storykey',
          formatter: (row, column, cellValue) => {
            var url = 'https://jira.successfactors.com/browse/' + cellValue;
            return <a href= {url} target="_blank">{cellValue}</a>;
          }
        }, {
          label: 'Summary',
          key: 'summary'
        }, {
          label: 'Status',
          key: 'status',
          formatter: (row, column, cellValue) => {
            return cellValue === 'initial' ? 'inprogress' : cellValue;
          }
        }, {
          label: 'Points',
          key: 'points'
        }, {
          label: 'Date',
          key: 'jiracreatedat',
          formatter: (row, column, cellValue) => {
            return new Date(cellValue).toLocaleString();
          }
        }]
      };
    },
    mounted () {
      var that = this;
      this.myChart = echarts.init(document.getElementById('inprogressChart'));
      this.myPie = echarts.init(document.getElementById('inprogressPie'));
      this.myChart.on('click', function (params) {
        if (params.type === 'click' && params.seriesType === 'bar') {
          that.tableData = params.data.list || [];
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
            show: true,
            data: ['Points', 'Count']
          },
          toolbox: {
            show: true,
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
      this.myPie.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a}<br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'center',
          data: ['Passed Days', 'Remaining Days']
        }
      });
    },
    methods: {
      setData: function (originalData) {
        var xAxis = ['Total', 'Commited', 'Done', 'Initial Commited'];
        var days = [{
          value: originalData.totaldays - originalData.leftdays,
          name: 'Passed Days'
        }, {
          value: originalData.leftdays,
          name: 'Remaining Days'        
        }];
        var pointsArr = [{
          value: originalData.totalpoints,
          name: 'Total',
          list: originalData.totalstories
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
          value: originalData.totalstories.length,
          list: originalData.totalstories
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
        this.myPie.setOption({
          series: {
            label: {
              normal: {
                formatter: '{c}d({d}%)'
              }
            },
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: days,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }        
          },
          color: ['#E6A23C', '#67C23A']
        });
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