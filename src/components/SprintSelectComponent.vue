<template>
  <div class="addPointDialogContainer">
    <div class="BISelectContainer">
      <el-dialog
        title="Select Sprint"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        class="addPointDialog">
        <el-alert style="margin: -20px 0px 20px 0px" title="The issue number and owner are required!" 
        type="warning" v-show="isShowAlert" @close="isShowAlert=false"></el-alert>
        <el-row>
          <el-col :span="24" v-for='sprintItem in sprintList' :key='sprintItem._id'>
            <div @click='selectSprint(sprintItem)'>{{sprintItem.release}} - {{sprintItem.sprint}}</div>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    'dialogDisplay': {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      biSelected: '',
      ownerSelected: '',
      isShowAlert: false,
      sprintList: [],
      sprintSelected: '',
      dialogVisible: false
    };
  },
  methods: {
    handleClose: function () {},
    selectSprint: function (sprintItem) {
      this.sprintItem = sprintItem;
      if (this.$root.eventHub) {
        this.$root.eventHub.$emit('sprintSelected', sprintItem);
      }
      this.dialogVisible = false;
    },
    queryData: function () {
      var self = this;
      this.axios.get('/api/v1/sprints').then(function (data) {
        console.log(data);
        self.sprintList = data.data.resData;
      });
    }
  },
  created: function () {
    this.dialogVisible = true;
    this.queryData();
  },
  mounted: function () {
  },
  watch: {
    biSelected: function () {
    },
    dialogDisplay: function () {
      if (this.dialogDisplay == null) {
        return;
      }
      this.dialogVisible = this.dialogDisplay;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.addPointDialogContainer .selections {
  margin-top: 20px;
}
.addPointDialogContainer .addPointDialog .el-dialog {
  min-width: 700px;
}
.addPointDialogContainer .grid-content {
  text-align: left;
  margin-bottom: 15px;
}
</style>
