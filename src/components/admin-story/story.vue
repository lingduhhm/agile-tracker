<template>
  <div class="home">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside style="width: 180px;">
        <el-menu class="left-menu" :collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect" default-active="dashboard">
          <el-menu-item index="dashboard" route="/dashboard">
            <i class="el-icon-menu"></i>
            <span slot="title">Dashboard</span>
          </el-menu-item>
          <el-menu-item index="storyadmin" route="/storyadmin">
            <i class="el-icon-menu"></i>
            <span slot="title">Story Management</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header style="font-size: 12px; background: #e4e4e4; padding: 20px;">
          <el-row>
            <el-col :span="4">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              </el-breadcrumb>
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
        isCollapse: false
      };
    },
    methods: {
      handleSelect (key, keyPath) {
        this.$router.push(key);
      }
    }
  };
</script>

<style scoped>


</style>