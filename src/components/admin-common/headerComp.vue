<template>
  <div>
    <el-row>
      <el-col :span="1">
        <el-button icon="el-icon-back" type="primary" @click="backToMainBoard" size="mini" style="padding: 5px 15px;" plain></el-button>
      </el-col>
      <el-col :span="2">
        <span style='font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif; color: #409EFF; font-size: 18px;'>{{$root.module}}</span>
      </el-col>
      <el-col :span="2" v-if="$route.params.sprintid">
        <el-dropdown style="float: right;"  @command="action">
          <span class="el-dropdown-link">
            Action<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add">Add</el-dropdown-item>
            <el-dropdown-item command="edit" v-if="sprintinfo.status != 'done'">Edit</el-dropdown-item>
            <el-dropdown-item command="proceed">{{sprintinfo.status == 'done'? "Restart": "Proceed"}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <template>
        <el-col :span="4" :offset="1">
          Work Days: {{(form.workdays && form.workdays.length) || 0}} days
        </el-col> 
        <el-col :span="4" :offset="1">
          Start Date: {{form.start}}
        </el-col> 
        <el-col :span="4" :offset="1">
          End Date: {{form.end}}
        </el-col> 
      </template>           
    </el-row>
    <el-dialog 
      :title="title" 
      :visible.sync="dialogVisible" 
      width="30%" 
      center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="Release">
          <el-input v-model="form.release"></el-input>
        </el-form-item>
        <el-form-item label="Sprint">
          <el-input v-model="form.sprint"></el-input>
        </el-form-item>
        <el-form-item label="Start">
          <el-date-picker 
            value-format="yyyy-MM-dd" 
            v-model="form.start"
            type="date"
            placeholder="select">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="End">
          <el-date-picker 
            value-format="yyyy-MM-dd" 
            v-model="form.end"
            type="date"
            placeholder="select">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="Work Days">
          <el-select v-model="form.workdays" multiple placeholder="Select">
            <el-option
              v-for="day in avaliableDays"
              :key="day.value"
              :label="day.label"
              :value="day.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="Date">
          Total Day: {{sprintSelectedDaysCount}}<br/>
          <datepicker :dateSelected="selectedDays" :startDate="form.start" :endDate="form.end"></datepicker>
        </el-form-item>
        <el-form-item label="JQL">
          <el-input type="textarea" :rows="2" v-model="form.jql"></el-input>
        </el-form-item>
        <el-form-item label="Status">
          <el-input v-model="form.status" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="actionExec">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import DatePicker from '@/components/DatePicker';
  import { Loading } from 'element-ui';

  export default {
    data () {
      return {
        sprintinfo: {},
        dialogVisible: false,
        title: 'Add',
        form: {
          workdays: []
        },
        defaultJql: '',
        sprintSelectedDaysCount: 0
      };
    },
    components: {
      'datepicker': DatePicker
    },
    created: function () {
      this.fetchData();
      if (this.$root.eventHub) {
        this.$root.eventHub.$on('datePickerChanged', this.calendarDateSelected);
      }
    },
    watch: {
      '$route': 'fetchData'
    },
    computed: {
      selectedDays: function () {
        var dateArray = [];
        for (var i = 0; i < this.avaliableDays.length; i++) {
          var d = new Date(this.avaliableDays[i].value).getDay();
          if (d !== 0 && d !== 6) {
            dateArray.push(this.avaliableDays[i].value);
          }
        }
        return dateArray;
      },
      avaliableDays: function () {
        var dateArray = [];
        var start = this.form.start || '';
        var end = this.form.end || '';
        var startTime = new Date(start + ' 00:00:00');
        var endTime = new Date(end + ' 00:00:00');
        while ((endTime.getTime() - startTime.getTime()) >= 0) {
          var year = startTime.getFullYear();
          var month = startTime.getMonth() + 1;
          var monthStr = month + '';
          if (month <= 10) {
            monthStr = '0' + month;
          }
          var day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate();
          dateArray.push({
            'value': year + '-' + monthStr + '-' + day,
            'label': year + '-' + monthStr + '-' + day
          });
          startTime.setTime(startTime.getTime() + 86400000);
        }
        return dateArray;
      }
    },
    methods: {
      fetchData () {
        var that = this;
        if (this.$route.params.sprintid !== undefined) {
          this.axios.get('/admin/sprint?sprintid=' + this.$route.params.sprintid + '&module=' + this.$root.module).then((response) => {
            if (response.data.status === 'success') {
              this.sprintinfo = response.data.resData.sprintinfo;
              this.defaultJql = response.data.resData.defaultJql;
              this.form = response.data.resData.sprintinfo;
            } else {
              that.$message({
                message: response.data.resMsg,
                type: response.data.status
              });
              if (response.data.redirect) {
                window.location.href = response.data.redirect;
              }
            }
          })
          .catch((err) => {
            console.log(err);
            that.$message({
              message: 'Data fetch failed!',
              type: 'error'
            });
          });
        }
      },
      calendarDateSelected: function (dateArr) {
        this.form.workdays = dateArr;
        this.sprintSelectedDaysCount = this.form.workdays.length;
      },
      action (command) {
        if (command === 'edit') {
          this.form = this.sprintinfo;
          this.dialogVisible = true;
          this.title = 'Edit Sprint';
        } else if (command === 'add') {
          this.form = {
            'status': 'planning',
            'jql': this.defaultJql
          };
          this.title = 'Add Sprint';
          this.dialogVisible = true;
        } else if (command === 'proceed') {
          var loading = Loading.service({fullscreen: true,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            text: 'Loading...'});
          var that = this;
          this.axios.put('/admin/sprint/proceed?status=' + this.$route.query.status + '&module=' + this.$root.module + '&sprintid=' + this.sprintinfo._id).then((response) => {
            if (response.data.status === 'success') {
              that.fetchData();
              that.$emit('refreshdata', {'type': 'proceed'});
            }
            loading.close();
            that.$message({
              message: response.data.resMsg,
              type: response.data.status
            });
          })
          .catch((err) => {
            console.log(err);
            that.$message({
              message: 'Data error!',
              type: 'error'
            });
          });
        }
      },
      backToMainBoard () {
        window.location.href = '/';
      },
      actionExec () {
        var that = this;
        if (this.form._id) {
          this.axios.put('/admin/sprint?module=' + this.$root.module, this.form).then((response) => {
            that.$message({
              message: response.data.resMsg,
              type: response.data.status
            });
            if (response.data.status === 'success') {
              that.$emit('refreshdata', {'type': 'edit'});
              that.dialogVisible = false;
            }
          })
          .catch((err) => {
            console.log(err);
            that.$message({
              message: 'Data error！',
              type: 'error'
            });
          });
        } else {
          this.form.module = this.$root.module;
          this.axios.post('/admin/sprint?module=' + this.$root.module, this.form).then((response) => {
            that.$message({
              message: response.data.resMsg,
              type: response.data.status
            });
            if (response.data.status === 'success') {
              that.$emit('refreshdata', {'type': 'add'});
              that.dialogVisible = false;
            }
          })
          .catch((err) => {
            console.log(err);
            that.$message({
              message: 'Data fetched failed！',
              type: 'error'
            });
          });
        }
      }
    }
  };
</script>

