<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="font">Current Sprint</span>
        <el-dropdown style="float: right; padding: 3px 0;"  @command="action">
          <span class="el-dropdown-link">
            Action<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add" >Add</el-dropdown-item>
            <el-dropdown-item command="edit" >Edit</el-dropdown-item>
            <el-dropdown-item command="scan" >Scan</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-form inline label-position="left" class="demo-table-expand">
        <el-form-item label="Release:">
          <span>{{cardInfo.release}}</span>
        </el-form-item>
        <el-form-item label="Sprint:">
          <span>{{cardInfo.sprint}}</span>
        </el-form-item>
        <el-form-item label="Start:">
          <span>{{cardInfo.start}}</span>
        </el-form-item>
        <el-form-item label="End:">
          <span>{{cardInfo.end}}</span>
        </el-form-item>
      </el-form>
    </el-card>
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
        <el-form-item label="Status">
          <el-select v-model="form.status" placeholder="Status">
            <el-option label="Inprogress" value="inprogress"></el-option>
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
  export default {
    data () {
      return {
        dialogVisible: false,
        title: 'Add',
        form: {},
        cardInfo: {}
      };
    },
    created: function () {
      this.fetchData();
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      fetchData () {
        var that = this;
        this.axios.get('/admin/sprint/latest').then((response) => {
          if (response.data.status === 'success') {
            that.cardInfo = response.data.resData || {};
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
      action (command) {
        if (command === 'edit') {
          this.dialogVisible = true;
          this.form = this.cardInfo;
          this.title = 'Edit Sprint';
        } else if (command === 'add') {
          this.form = {};
          this.title = 'Add Sprint';
          this.dialogVisible = true;
        } else if (command === 'scan') {
          var that = this;
          this.axios.patch('/admin/sprint?objid=' + that.cardInfo._id).then((response) => {
            that.$message({
              message: '扫描成功！',
              type: 'success'
            });
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
              if (that.form.status === 'inprogress') {
                that.cardInfo = that.form || {};
              } else {
                that.fetchData();
              }
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
              if (response.data.resData.status === 'inprogress') {
                that.cardInfo = response.data.resData;
              }
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
    }
  };
</script>

<style scoped>
  .font{
    color: #409EFF;
    size: 16px;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-weight: bold;
  }

</style>