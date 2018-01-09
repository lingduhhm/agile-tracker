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
          <el-menu-item v-for="item in menu" :index="item._id" :key="item._id">
            <i :class="[item.status === 'done'? 'el-icon-check' : 'el-icon-tickets']"></i>
            <span slot="title">{{item.release}}/{{item.sprint}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="font-size: 12px; background: #e4e4e4; padding: 20px;">
          <el-row>
            <el-col :span="4">
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        isCollapse: false,
        menu: []
      };
    },
    methods: {
      fetchData () {
        var that = this;
        this.axios.get('/admin/sprint?limit=8').then((response) => {
          if (response.data.status === 'success') {
            this.menu = response.data.resData;
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
      handleSelect (key, keyPath) {
        this.$router.push(key);
        this.$router.push('/dashboard');
      }
    },
    created: function () {
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