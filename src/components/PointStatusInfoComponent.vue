/*
  author: onwebbe (tai)
*/
<template>
  <div class="pointInfoContainer">
    <el-header class="pointStatus">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="12">
          <span class="pointInfoTitle">Point Status</span>
        </el-col>
        <el-col :span="6">
          <i class="el-icon-circle-plus-outline pointContent" @click="openDialog"></i>
          <add-point-dialog :dialogDisplay="dialogDisplay"></add-point-dialog>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="padding: 0;">
      <div class="pointChangedHis">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="9">
            <i class="el-icon-caret-bottom successContent"></i>
            <span class="successContent">2</span>
          </el-col>
          <el-col :span="9">
            <i class="el-icon-caret-top blockContent"></i>
            <span class="blockContent">5</span>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around" style="height: 30px;line-height: 30px;">
          <el-col :span="9">
            <span class="pointInfoTitle listItem">Current Points:</span>
          </el-col>
          <el-col :span="9">
            <span class="pointContent">{{testData[4].currentPoint}} points</span>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around" style="height: 30px;line-height: 30px;">
          <el-col :span="9">
            <span class="pointInfoTitle">Previous Points:</span>
          </el-col>
          <el-col :span="9">
            <span class="successContent">{{testData[4].previousPoint}} points</span>
          </el-col>
        </el-row>
      </div>
      <div class="pointChangedItem">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="21">
            <span class="pointInfoTitle">Changed Items  ( {{testData[4].changedItem.length}} )</span>
          </el-col>
        </el-row>
        <el-table :data="testData[4].changedItem" class="changeItemTab" style="width: 100%" :show-header="false">
          <el-table-column prop="storyId" style="width: 30%"></el-table-column>
          <el-table-column prop="points" style="width: 30%"></el-table-column>
          <el-table-column prop="status"></el-table-column>
        </el-table>
      </div>
    </el-main>
  </div>
</template>

<script>
import AddDialogContent from '@/components/AddPointDialogComponent';
export default {
  data () {
    return {
      dialogDisplay: false,
      testData: [{
        currentPoint: 40,
        previousPoint: 40,
        changedItem: []
      }, {
        currentPoint: 35,
        previousPoint: 40,
        changedItem: [{
          storyId: 'CDP-4815',
          points: 5,
          status: 'Done'
        }]
      }, {
        currentPoint: 35,
        previousPoint: 35,
        changedItem: []
      }, {
        currentPoint: 20,
        previousPoint: 35,
        changedItem: [{
          storyId: 'CDP-4812',
          points: 15,
          status: 'Done'
        }]
      }, {
        currentPoint: 20,
        previousPoint: 20,
        changedItem: [{
          storyId: 'CDP-4819',
          points: 5,
          status: 'Done'
        }, {
          storyId: 'CDP-5819',
          points: 5,
          status: 'Add'
        }]
      }, {
        currentPoint: 10,
        previousPoint: 10,
        changedItem: []
      }],
      tableData1: [{
        storyId: 'CDP-4811',
        points: '3 Points',
        status: 'Active',
        primaryCount: '3 Points'
      }, {
        storyId: 'CDP-4812',
        points: '3 Points',
        status: 'Active',
        primaryCount: '4 Points'
      }, {
        storyId: 'CDP-4823',
        points: '5 Points',
        status: 'Active',
        primaryCount: '5 Points'
      }, {
        storyId: 'CDP-4814',
        points: '3 Points',
        status: 'Active',
        primaryCount: '3 Points'
      }, {
        storyId: 'CDP-4815',
        points: '3 Points',
        status: 'Active',
        primaryCount: '10 Points'
      }, {
        storyId: 'CDP-4816',
        points: '5 Points',
        status: 'Active',
        primaryCount: '9 Points'
      }]
    };
  },
  created: function () {
  },
  mounted: function () {
  },
  methods: {
    openDialog: function () {
      this.dialogDisplay = true;
      var self = this;
      setTimeout(function () {
        self.dialogDisplay = null;
      });
    },
    handleClose () {}
  },
  components: {
    'add-point-dialog': AddDialogContent
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../css/globalDefine';
.dataSheet {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
}
.dataSheet > div {
  flex-grow: 1;
  flex: flex-grow;
}
.pointStatus i{
  font-size: 24px;
}
.pointChangedHis i {
  font-size:35px; 
  vertical-align:top;
}
.pointStatus,
.pointChangedHis,
.pointChangedItem{
  line-height: 40px;
  border-bottom: 1px solid @borderColor;
}
.pointChangedItem {
  border: none;
}
.pointInfoTitle{
  display: block;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
}
</style>
