/*
  author: onwebbe (tai)
*/
<template>
  <div class="dataSheet">
    <el-header class="dataSheetSummary">
      <div class='title'>
        Summary
      </div>
      <div class='content'>
        <el-row>
          <el-col :span="8"><div class="grid-content bg-purple-dark pointContent">10 Point</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-dark blockContent">2 Block</div></el-col>
          <el-col :span="8"><div class="grid-content bg-purple-dark followContent">3 Follow</div></el-col>
        </el-row>
      </div>
    </el-header>
    <el-main class="tabContainer">
      <el-tabs type="border-card" class="dataSheetTabs">
        <el-tab-pane label="Points" class="dataSheetTabItem">
          <point-status></point-status>
        </el-tab-pane>
        <el-tab-pane label="Blocks" class="dataSheetTabItem">
          <block-issues></block-issues>
        </el-tab-pane>
        <el-tab-pane label="Follows" class="dataSheetTabItem">
          <followups></followups>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </div>
</template>

<script>
import PointStatus from '@/components/PointStatusInfoComponent';
import BlockIssues from '@/components/BlockIssuesInfoComponent';
import Followups from '@/components/FollowupInfoComponent';
export default {
  name: 'DataSheet',
  data () {
    return {
      displayData: {
        currentTab: 'points'
      }
    };
  },
  created: function () {
  },
  mounted: function () {
  },
  components: {
    'point-status': PointStatus,
    'block-issues': BlockIssues,
    'followups': Followups
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
  font-size: 18px;
}
.dataSheet .dataSheetSummary .pointContent {
  color: @blueColor;
}
.dataSheet .dataSheetSummary .blockContent {
  color: @dangerColor;
}
.dataSheet .dataSheetSummary .followContent {
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
  width: 100% !important;
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
</style>
