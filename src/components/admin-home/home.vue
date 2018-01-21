<style lang="less">
    @import './home.less';
</style>

<template>
  <div class="home">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside style="width: 180px;">
        <el-menu class="left-menu" :collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" default-active="dashboard">
          <el-menu-item index="dashboard" route="/dashboard">
            <i class="el-icon-menu"></i>
            <span slot="title">Dashboard</span>
          </el-menu-item>
          <el-menu-item index="planning" route="/planning">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">Planning</span>
          </el-menu-item>
          <el-menu-item v-for="item in menu" :index="item._id" :key="item._id">
            <i :class="[item.status === 'done'? 'el-icon-check' : 'el-icon-tickets']"></i>
            <span slot="title">{{(item && item.release) || ''}}/{{item.sprint}}</span>
          </el-menu-item>
          <el-menu-item index="configuration" route="/configuration">
            <i class="el-icon-setting"></i>
            <span slot="title">Configuration</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="font-size: 12px; background: #e4e4e4; padding: 20px;">
          <el-row>
            <el-col :span="1">
              <span style='font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif; color: #409EFF; font-size: 18px;'>{{module}}</span>
            </el-col>
            <el-col :span="2" v-if="$route.query.status!='configuration'">
              <el-dropdown style="float: right;"  @command="action">
                <span class="el-dropdown-link">
                  Action<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add" v-if="!$route.params.category">Add</el-dropdown-item>
                  <el-dropdown-item command="edit" v-if="$route.params.category">Edit</el-dropdown-item>
                  <el-dropdown-item command="proceed">Proceed</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <template v-if="sprintObjId">
              <el-col :span="2" :offset="1">
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
        </el-header>
        <el-main>
          <router-view ref="sprintPage"></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog 
      :title="title" 
      :visible.sync="dialogVisible" 
      width="30%" 
      center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="Module">
          <el-select v-model="form.module" placeholder="module">
            <el-option label="CDP" value="CDP"></el-option>
          </el-select>
        </el-form-item>
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
          Total Day: 12<br/>
          <datepicker :dateSelected="selectedDays" :startDate="form.start" :endDate="form.end"></datepicker>
        </el-form-item>
        <el-form-item label="Groups">
          <el-select v-model="form.sprintgroups" multiple placeholder="Select">
            <el-option
              v-for="group in groups"
              :key="group._id"
              :label="group.groupname"
              :value="group._id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="JQL">
          <el-input v-model="form.jql"></el-input>
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
  import { Loading } from 'element-ui';
  import DatePicker from '@/components/DatePicker';

  export default {
    data () {
      return {
        isHadPlanning: false,
        isHadInprogress: false,
        isCollapse: false,
        menu: [],
        dialogVisible: false,
        title: 'Add',
        form: {
          workdays: []
        },
        sprintObjId: '',
        module: this.$root.module,
        groups: []
      };
    },
    components: {
      'datepicker': DatePicker
    },
    watch: {
      $route: 'fetchData'
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
        var getDate = function (datestr) {
          var temp = datestr.split('-');
          var date = new Date(temp[0], temp[1], temp[2]);
          return date;
        };
        var startTime = getDate(start);
        var endTime = getDate(end);
        while ((endTime.getTime() - startTime.getTime()) >= 0) {
          var year = startTime.getFullYear();
          var month = startTime.getMonth().toString().length === 1 ? '0' + startTime.getMonth().toString() : startTime.getMonth();
          var day = startTime.getDate().toString().length === 1 ? '0' + startTime.getDate() : startTime.getDate();
          dateArray.push({
            'value': year + '-' + month + '-' + day,
            'label': year + '-' + month + '-' + day
          });
          startTime.setDate(startTime.getDate() + 1);
        }
        return dateArray;
      }
    },
    methods: {
      calendarDateSelected: function (dateArr) {
        this.form.workdays = dateArr;
      },
      fetchData () {
        var that = this;
        this.axios.get('/admin/sprint?limit=8&module=' + this.$root.module).then((response) => {
          if (response.data.status === 'success') {
            that.menu = response.data.resData;
            that.menuMap = that.jsonfy(that.menu);
            this.form = this.$route.params.category ? this.menuMap[this.$route.params.category] : {};
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
            message: 'Data fetch failed!',
            type: 'error'
          });
        });

        this.axios.get('/admin/groups/' + this.$root.module).then((response) => {
          if (response.data.status === 'success') {
            that.groups = response.data.resData;
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
            message: 'Data fetch failed!',
            type: 'error'
          });
        });
      },
      jsonfy (data) {
        var mapRes = {};
        data.forEach((value, key, arr) => {
          if (value.status === 'planning') {
            this.isHadPlanning = true;
          }
          if (value.status === 'inprogress') {
            this.isHadInprogress = true;
          }
          mapRes[value._id] = value;
        });
        return mapRes;
      },
      handleSelect (key, keyPath) {
        if ((key === 'dashboard') || (key === 'planning') || (key === 'configuration')) {
          this.sprintObjId = '';
          this.$router.push('/' + key + '?status=' + (key === 'dashboard' ? 'inprogress' : key));
        } else if (key) {
          this.sprintObjId = key;
          this.form = this.menuMap[key];
          this.$router.push('/story/' + key);
        } else {
          this.sprintObjId = '';
          this.$router.push('/dashboard?status=inprogress');
        }
      },
      action (command) {
        if (command === 'edit') {
          this.dialogVisible = true;
          this.title = 'Edit Sprint';
        } else if (command === 'add') {
          this.form = {
            'status': 'planning'
          };
          this.title = 'Add Sprint';
          this.dialogVisible = true;
        } else if (command === 'proceed') {
          var loading = Loading.service({fullscreen: true,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            text: 'Scanning...'});
          var that = this;
          this.axios.put('/admin/sprint/proceed?status=' + this.$route.query.status + '&module=' + this.$root.module + '&sprintid=' + this.$route.params.category).then((response) => {
            loading.close();
            that.$message({
              message: response.data.resMsg,
              type: response.data.status
            });
            this.fetchData();
            this.$refs.sprintPage.fetchData();
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
      actionExec () {
        var that = this;
        if (this.form._id) {
          this.axios.put('/admin/sprint', this.form).then((response) => {
            that.$message({
              message: response.data.resMsg,
              type: response.data.status
            });
            if (response.data.status === 'success') {
              that.dialogVisible = false;
              that.menu = response.data.resData;
              that.menuMap = that.jsonfy(that.menu);
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
          this.axios.post('/admin/sprint', this.form).then((response) => {
            that.$message({
              message: response.data.resMsg,
              type: response.data.status
            });
            if (response.data.status === 'success') {
              that.menu = response.data.resData;
              that.menuMap = that.jsonfy(that.menu);
              that.dialogVisible = false;
            }
          })
          .catch((err) => {
            console.log(err);
            that.$message({
              message: '数据保存失败！',
              type: 'error'
            });
          });
        }
      }
    },
    created: function () {
      this.handleSelect();
      this.fetchData();
      if (this.$root.eventHub) {
        this.$root.eventHub.$on('datePickerChanged', this.calendarDateSelected);
      }
    }
  };
</script>

<style scoped>
  .left-menu{
    height: 100%;
    text-align: left;
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    height: 100%;
  }

</style>