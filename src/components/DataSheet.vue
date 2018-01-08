/*
  author: onwebbe (tai)
*/

<template>
  <div class="dataSheet">
    <el-header class="dataSheetSummary">
      <div class='title'>
        Summary Day 4
      </div>
      <!-- <div class='content'>
        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple-dark pointContent">10 Point</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-dark blockContent">2 Block</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-dark followContent">3 Follow</div></el-col>
        </el-row>
      </div> -->
    </el-header>
    <el-main class="tabContainer">
      <el-tabs type="border-card" class="dataSheetTabs">
        <el-tab-pane label="Points (10)" class="dataSheetTabItem">
          <point-status></point-status>
        </el-tab-pane>
        <el-tab-pane label="Blocks (2)" class="dataSheetTabItem">
          <block-issues></block-issues>
        </el-tab-pane>
        <el-tab-pane label="Follows (3)" class="dataSheetTabItem">
          <followups></followups>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <div @click="openDialog">opendialog</div>
    <add-point-dialog :dialogDisplay="dialogDisplay"></add-point-dialog>
  </div>
</template>

<script>
import PointStatus from '@/components/PointStatusInfoComponent';
import BlockIssues from '@/components/BlockIssuesInfoComponent';
import Followups from '@/components/FollowupInfoComponent';
import AddDialogContent from '@/components/AddPointDialogComponent';
export default {
  name: 'DataSheet',
  data () {
    return {
      dialogDisplay: false,
      displayData: {
        currentTab: 'points'
      }
    };
  },
  methods: {
    openDialog: function () {
      this.dialogDisplay = true;
      var self = this;
      setTimeout(function () {
        self.dialogDisplay = null;
      });
    }
  },
  created: function () {
  },
  mounted: function () {
  },
  components: {
    'point-status': PointStatus,
    'block-issues': BlockIssues,
    'followups': Followups,
    'add-point-dialog': AddDialogContent
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
@import '../css/globalDefine';
.dataSheet {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.dataSheet .dataSheetSummary .content{
  padding-top: 5px;
}
.dataSheet .dataSheetSummary .title {
  font-size: 25px;
  font-weight: bold;
}
.dataSheet .pointContent {
  color: @blueColor;
}
.dataSheet .blockContent {
  color: @dangerColor;
}
.dataSheet .followContent {
  color: @warningColor;
}
.dataSheet .tabContainer {
  height: calc( 100% - 18px) ;
  padding-top: 5px;
  padding-bottom: 5px;
}
.dataSheet .dataSheetTabs {
  height: calc( 100% - 2px );
}
.dataSheet .dataSheetTabs .el-tabs__nav {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
}
.dataSheet .dataSheetTabs .el-tabs__nav .el-tabs__item {
  flex-grow: 1;
  flex: flex-grow;
}
.dataSheet .dataSheetTabs .el-tabs__nav .el-tabs__item:nth-child(1) {
  color: @blueColor;
}
.dataSheet .dataSheetTabs .el-tabs__nav .el-tabs__item:nth-child(2) {
  color: @dangerColor;
}
.dataSheet .dataSheetTabs .el-tabs__nav .el-tabs__item:nth-child(3) {
  color: @warningColor;
}
.dataSheet .el-tabs__content{
  padding-left: 0px;
  padding-right: 0px;
}
</style>
