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
            <span slot="title">{{item.release}}/{{item.sprint}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="font-size: 12px; background: #e4e4e4; padding: 20px;">
          <el-row>
            <el-col :span="2">
              <el-dropdown style="float: right; padding: 3px 0;"  @command="action">
                <span class="el-dropdown-link">
                  Action<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add" v-if="!$route.params.category">Add</el-dropdown-item>
                  <el-dropdown-item command="edit" v-if="$route.params.category">Edit</el-dropdown-item>
                  <el-dropdown-item command="scan" v-if="$route.params.category">Scan</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
            <template v-if="sprintObjId">
              <el-col :span="2" :offset="1">
                Work Days: {{form.workdays || 0}} days
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
        <el-form-item label="Release">
          <el-input v-model="form.release"></el-input>
        </el-form-item>
        <el-form-item label="Sprint">
          <el-input v-model="form.sprint"></el-input>
        </el-form-item>
        <el-form-item label="Work Days">
          <el-input-number v-model="form.workdays"></el-input-number>
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
        <el-form-item label="Status">
          <el-select v-model="form.status" placeholder="Status">
            <el-option label="Planning" value="planning" v-if="!isHadPlanning"></el-option>
            <el-option label="Inprogress" value="inprogress" v-if="!isHadInprogress"></el-option>
            <el-option label="Done" value="done"></el-option>
          </el-select>
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

  export default {
    data () {
      return {
        isHadPlanning: false,
        isHadInprogress: false,
        isCollapse: false,
        menu: [],
        dialogVisible: false,
        title: 'Add',
        form: {},
        sprintObjId: ''
      };
    },
    watch: {
      $routes: 'fetchData'
    },
    methods: {
      fetchData () {
        var that = this;
        this.axios.get('/admin/sprint?limit=8').then((response) => {
          if (response.data.status === 'success') {
            that.menu = response.data.resData;
            that.menuMap = that.jsonfy(that.menu);
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
            message: '数据获取失败！',
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
        if (key === 'dashboard') {
          this.sprintObjId = '';
          this.$router.push('/' + key);
        } else if (key) {
          this.sprintObjId = key;
          this.form = this.menuMap[key];
          this.$router.push('/story/' + key);
        } else {
          this.sprintObjId = '';
          this.$router.push('/dashboard');
        }
      },
      action (command) {
        if (command === 'edit') {
          this.dialogVisible = true;
          this.title = 'Edit Sprint';
        } else if (command === 'add') {
          this.form = {};
          this.title = 'Add Sprint';
          this.dialogVisible = true;
        } else if (command === 'scan') {
          var loading = Loading.service({fullscreen: true,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
            text: 'Scanning...'});
          var that = this;
          this.axios.patch('/admin/sprint?sprint=' + that.sprintObjId).then((response) => {
            loading.close();
            that.$message({
              message: response.data.resMsg,
              type: response.data.status
            });
            this.$refs.sprintPage.fetchData();
          })
          .catch((err) => {
            console.log(err);
            that.$message({
              message: '数据保存失败！',
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
              message: '数据保存失败！',
              type: 'error'
            });
          });
        } else {
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