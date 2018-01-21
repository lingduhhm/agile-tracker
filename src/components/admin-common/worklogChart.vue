
<template>
  <div>
    <el-card class="box-card">
      <div id="worklogChart" style="height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  import { Loading } from 'element-ui';
  var echarts = require('echarts/lib/echarts');
  require('echarts');

  export default {
    mounted () {
      this.myChart = echarts.init(document.getElementById('worklogChart'));
      this.myChart.setOption(
        {
          title: {
            text: 'Effort Track Status'
          },
          tooltip: {
            show: true,
            trigger: 'item'
          },
          legend: {
            data: ['Left', 'Logged']
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          yAxis: {
            type: 'value',
            name: 'Hours',
            axisLabel: {
              formatter: '{value}'
            }
          },
          xAxis: {
            type: 'category',
            data: []
          },
          series: [
            {
              name: 'Left',
              type: 'bar',
              stack: 'Left',
              data: [],
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
              markLine: {
                data: [
                  {type: 'average', name: '平均值'}
                ]
              }
            },
            {
              name: 'Logged',
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
              data: [],
              markLine: {
                data: [
                  {type: 'average', name: '平均值'}
                ]
              }
            }
          ]
        });
    },
    methods: {
      fetchData: function (isRefresh, sprintinfo) {
        this.sprintinfo = sprintinfo;
        if (!this.sprintinfo._id) {
          this.setData({
            resData: {
              data: {}
            }
          });
          return false;
        }
        var loading = Loading.service({fullscreen: true,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          text: 'Loading...'});
        var that = this;
        var options = 'refresh=' + (isRefresh || '') + '&sprintid=' + (this.sprintinfo._id || '') + '&start=' + (this.sprintinfo.start || '') + '&end=' + (this.sprintinfo.end || '') + '&module=' + this.$root.module;
        this.axios.get('/admin/dashboard/worklog?' + options)
        .then(function (response) {
          loading.close();
          if (response.data.status === 'success') {
            that.setData(response.data);
          } else {
            that.$message({
              message: response.data.resMsg,
              type: response.data.status
            });
          }
        })
        .catch(function (err) {
          console.log(err);
          that.$message({
            message: 'Data request failed!',
            type: 'error'
          });
        });
      },
      refresh: function () {
        this.fetchData('y');
      },
      setData: function (originalData) {
        var data = originalData.resData ? originalData.resData.data : {};
        var usermap = originalData.usermap || {};
        var xAxis = [];
        var leftArr = [];
        var loggedArr = [];
        for (var key in data) {
          xAxis.push((usermap[key] || key));
          leftArr.push(data[key].leftEstimate / 3600);
          loggedArr.push(data[key].loggedEffort / 3600);
        }
        this.myChart.setOption({
          xAxis: {
            type: 'category',
            data: xAxis
          },
          series: [
            {
              name: 'Left',
              type: 'bar',
              stack: 'Left',
              data: leftArr,
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
              }
            },
            {
              name: 'Logged',
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
              data: loggedArr
            }
          ]
        });
      }
    }
  };
</script>