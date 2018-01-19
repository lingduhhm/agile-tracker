
<template>
  <div>
    <el-card class="box-card">
      <div id="estimationChart" style="height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
  import { Loading } from 'element-ui';
  var echarts = require('echarts/lib/echarts');
  require('echarts');

  export default {
    props: ['sprintinfo'],
    watch: {
      sprintinfo: function (newVal, oldVal) {
        if (!oldVal) {
          this.fetchData();
        }
      }
    },
    mounted () {
      this.myChart = echarts.init(document.getElementById('estimationChart'));
      this.fetchData('');
      this.myChart.setOption(
        {
          title: {
            text: 'Estimation Overview'
          },
          tooltip: {
            show: true,
            trigger: 'item'
          },
          legend: {
            show: true,
            data: ['Capacity', 'Estimated']
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
              name: 'Capacity',
              type: 'bar',
              stack: 'Capacity',
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
              data: [],
              markLine: {
                data: [
                  {type: 'average', name: '平均值'}
                ]
              }
            },
            {
              name: 'Estimated',
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
      fetchData: function (isRefresh) {
        if (!this.sprintinfo) {
          return false;
        }
        var loading = Loading.service({fullscreen: true,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
          text: 'Loading...'});
        var that = this;
        var options = 'refresh=' + (isRefresh || '') + '&sprintid=' + (this.sprintinfo._id || '') + '&start=' + (this.sprintinfo.start || '') + '&end=' + (this.sprintinfo.end || '') + '&module=' + this.$root.module;
        this.axios.get('/admin/planning/estimation?' + options)
        .then(function (response) {
          if (isRefresh === 'y') {
            that.$emit('updatepints');
          }
          loading.close();
          if (response.data.status === 'success') {
            if (response.data.resData) {
              that.setData(response.data);
            }
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
        var data = originalData.resData.data;
        var capacity = originalData.capacity;
        var usermap = originalData.usermap;
        var xAxis = [];
        var capacityArr = [];
        var estimatedArr = [];
        for (var key in data) {
          xAxis.push((usermap[key] || key));
          capacityArr.push(capacity[key]);
          estimatedArr.push(data[key].leftEstimate / 3600);
        }
        this.myChart.setOption({
          xAxis: {
            type: 'category',
            data: xAxis
          },
          series: [
            {
              name: 'Capacity',
              type: 'bar',
              stack: 'Capacity',
              data: capacityArr,
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
              name: 'Estimated',
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
              data: estimatedArr
            }
          ]
        });
      }
    }
  };
</script>