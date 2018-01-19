/*
  author: onwebbe (tai)
*/
<template>
  <div class="pointInfoContainer">
    <el-header class="pointStatus" style="height: 40px;">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="12">
          <span class="pointInfoTitle">Point Status</span>
        </el-col>
        <el-col :span="6">
          <i ref="addIcon" v-show="showAddIcon" class="el-icon-circle-plus-outline pointContent" @click="openDialog"></i>
          <add-point-dialog @newItemAdded="updateChangeItems" :dialogDisplay="dialogDisplay"></add-point-dialog>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="padding: 0;">
      <div class="pointChangedHis">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="9">
            <i class="el-icon-caret-bottom successContent"></i>
            <span class="successContent">{{reduceCount}}</span>
          </el-col>
          <el-col :span="9">
            <i class="el-icon-caret-top blockContent"></i>
            <span class="blockContent">{{addCount}}</span>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around" style="height: 30px;line-height: 30px;">
          <el-col :span="9">
            <span class="pointInfoTitle listItem">Today Points:</span>
          </el-col>
          <el-col :span="9">
            <span class="pointContent">{{currentPoint}} points</span>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around" style="height: 30px;line-height: 30px;">
          <el-col :span="9">
            <span class="pointInfoTitle">LastDay Points:</span>
          </el-col>
          <el-col :span="9">
            <span class="successContent">{{previousPoint}} points</span>
          </el-col>
        </el-row>
      </div>
      <div class="pointChangedItem">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="21">
            <span class="pointInfoTitle">Changed Items  ( {{changedItems.length}} )</span>
          </el-col>
        </el-row>
        <el-table :data="changedItems" class="changeItemTab" style="width: 100%" :show-header="false" :row-class-name="tableRowClassName">
          <el-table-column prop="storykey" width="120"></el-table-column>
          <el-table-column prop="points" width="50"></el-table-column>
          <el-table-column prop="status" ></el-table-column>
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
      group: '',
      showAddIcon: false,
      dialogDisplay: false,
      reduceCount: 0,
      addCount: 0,
      currentPoint: 0,
      previousPoint: 0,
      changedItems: [],
      currentData: {},
      previousData: {}
    };
  },
  created: function () {
    if (this.$root.eventHub) {
      this.$root.eventHub.$on('getDaySummary', this.getDayStorySummary);
    }
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
    tableRowClassName ({row, rowIndex}) {
      var tableRowList = this.changedItems;
      if (tableRowList[rowIndex].status === 'Add') {
        return 'blockContent';
      } else if (tableRowList[rowIndex].status === 'Ready for testing') {
        return 'successContent';
      }
      return '';
    },
    updateChangeItems (item) {
      item.points = item.storypoints;
      this.reduceCount += item.points;
      this.changedItems.unshift(item);
      this.currentPoint -= item.points;
      this.currentData.points['red'] += item.points;
    },
    getDayStorySummary (day, group, todayObj, previousObj, type) {
      this.group = group;
      this.currentData = todayObj['groups'][group];
      this.previousData = previousObj['groups'][group];
      this.reduceCount = this.currentData['points']['red'];
      this.addCount = this.currentData['points']['add'];
      this.currentPoint = this.currentData.currentPoint;
      this.previousPoint = this.previousData.currentPoint;

      this.changedItems = todayObj.storyList;
      var length = this.$root.summary.summary.length - 1;
      if (day === length) {
        this.showAddIcon = true;
      } else {
        this.showAddIcon = false;
      }
    }
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
header.pointStatus {
  line-height: 25px;
  padding: 0;
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
