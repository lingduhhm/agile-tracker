<template>
  <el-menu class="left-menu" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :default-active="this.$route.path" @select="handleSelect" :unique-opened="true" ref="sidebarMenu" :collapse="isCollapse">
    <el-submenu index="dashboard" route="/dashboard">
      <template  slot="title">
        <i class="el-icon-menu"></i>
        <span slot="title">Dashboard<span class="hint">({{inprogress.length}})</span></span>
      </template>
      <el-menu-item-group v-for="item in inprogress" :key="item._id">
        <span slot="title">{{item.release}}/{{item.sprint}}</span>
        <el-menu-item :index="'/dashboard/'+item._id" route="/dashboard/">View Dashboard</el-menu-item>
        <el-menu-item :index="'/story/'+item._id" route="/story/">Edit Stories</el-menu-item>
      </el-menu-item-group>
    </el-submenu>

    <el-submenu index="planning" route="/planning">
      <template  slot="title">
        <i class="el-icon-edit-outline"></i>
        <span slot="title">Planning<span class="hint">({{planning.length}})</span></span>
      </template>
      <el-menu-item-group v-for="item in planning" :key="item._id">
        <span slot="title">{{item.release}}/{{item.sprint}}</span>
        <el-menu-item :index="'/planning/'+item._id" route="/planning/">View Dashboard</el-menu-item>
        <el-menu-item :index="'/story/'+item._id" route="/story/">Edit Stories</el-menu-item>
      </el-menu-item-group>
    </el-submenu>

    <el-submenu index="done" route="/done">
      <template  slot="title">
        <i class="el-icon-check"></i>
        <span slot="title">Done<span class="hint">({{done.length}})</span></span>
      </template>
      <el-menu-item-group v-for="item in done" :key="item._id">
        <span slot="title">{{item.release}}/{{item.sprint}}</span>
        <el-menu-item :index="'/dashboard/'+item._id" route="/dashboard/">View Dashboard</el-menu-item>
        <el-menu-item :index="'/story/'+item._id" route="/story/">Edit Stories</el-menu-item>
      </el-menu-item-group>
    </el-submenu>

    <el-menu-item index="/configuration" route="/configuration">
      <i class="el-icon-setting"></i>
      <span slot="title">Configuration</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
  export default {
    data () {
      return {
        menuMap: {},
        planning: [],
        inprogress: [],
        done: [],
        isCollapse: false
      };
    },
    created: function () {
      this.$root.eventHub.$on('refreshDataRequest', () => {
        this.fetchData();
      });
    },
    methods: {
      fetchData () {
        var that = this;
        this.axios.get('/admin/sprint?limit=8&module=' + window.localStorage.getItem('module')).then((response) => {
          if (response.data.status === 'success') {
            var menu = response.data.resData;
            that.menuMap = that.jsonfy(menu);
            that.openDefaultTab();
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
      },
      jsonfy (data) {
        var mapRes = {};
        this.inprogress = [];
        this.planning = [];
        this.done = [];
        data.forEach((value, key, arr) => {
          if (value && value.length > 0) {
            value.forEach(function (item, index, list) {
              if (!mapRes[item._id]) {
                mapRes[item._id] = item;
              }
            });
          }
        });
        for (var key in mapRes) {
          if (mapRes[key].status === 'planning') {
            this.planning.push(mapRes[key]);
          }
          if (mapRes[key].status === 'inprogress') {
            this.inprogress.push(mapRes[key]);
          }
          if (mapRes[key].status === 'done') {
            this.done.push(mapRes[key]);
          }
        }
        return mapRes;
      },
      handleSelect (key, keyPath) {
        this.$root.eventHub.$emit('changeSprintRequst');
      },
      openDefaultTab () {
        if (window.localStorage.getItem('sprint')) {
          this.$refs.sidebarMenu.open(window.localStorage.getItem('sprint'));
        } else {
          if (this.inprogress[0]) {
            window.localStorage.setItem('sprint', this.inprogress[0]._id);
            this.$refs.sidebarMenu.open('dashboard');
          } else if (this.planning[0]) {
            window.localStorage.setItem('sprint', this.planning[0]._id);
            this.$refs.sidebarMenu.open('planning');
          } else if (this.done[0]) {
            window.localStorage.setItem('sprint', this.done[0]._id);
            this.$refs.sidebarMenu.open('done');
          } else {
            this.$refs.sidebarMenu.open('configuration');
          }
        }
      }
    }
  };
</script>

<style scoped>
  .hint{
    color: rgb(202, 165, 33);
    font-size: 13px;
    font-weight: bolder;
  }
</style>