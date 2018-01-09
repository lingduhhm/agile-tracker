<template>
  <el-container>
    <el-header style="text-align: left; font-size: 14px; font-weight:600; height: 36px" class="blockSheetHeader">
      <el-row>
        <el-col :span="20"><span>Block Issues</span></el-col>
        <el-col :span="4">
          <i style="font-size: 20px" class="el-icon-circle-plus-outline addIssueIcon" @click="openDialog"></i>
          <add-block-dialog :dialogDisplay="dialogDisplay"></add-block-dialog>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="padding-top: 5px; padding-left:0px; padding-right:0px">
      <el-row>
        <el-col :span="12">
          <i style="font-size: 35px; vertical-align: middle;" class="el-icon-caret-bottom reducedIssueIcon"></i>
          <span style="font-size: 20px; vertical-align: middle" class="textSuccColor">2</span>
        </el-col>
        <el-col :span="12">
          <i style="font-size: 35px; vertical-align: middle" class="el-icon-caret-top addedIssueIcon"></i>
          <span style="vertical-align: middle" class="textDangerColor">2</span>
        </el-col>
      </el-row>
      <el-row style="text-align: left; padding-left: 20px; margin: 5px 0 7px">
        <el-col :span="20">
          <span style="font-size: 14px; font-weight:600; text-align: left">Current Blockers：</span>
        </el-col>
        <el-col :span="4">
          <span class="textDangerColor">{{currentblockersnum}}</span>
        </el-col>
      </el-row>
      <el-row style="text-align: left; padding-left: 20px" class="blockSheetSummary">
        <el-col :span="20">
          <span style="font-size: 14px; font-weight:600; text-align: left">Previous Blockers：</span>
        </el-col>
        <el-col :span="4">
          <span class="textDangerColor">{{previousblockersnum}}</span>
        </el-col>
      </el-row>
      <el-row style="text-align: left; padding-left: 20px">
        <el-col :span="12">
          <span>Issues ({{issues.length}})</span>
        </el-col>
        <el-col :span="12">
          <span>Show All</span>
          <el-switch :value="true" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </el-col>
      </el-row>
      <el-table :data="issues"
       :show-header=false 
       :row-class-name="tableRowClassName"
        max-height="300" 
        style="width: 100%">
        <el-table-column prop="issuekey" style="width: 30%">
        </el-table-column>
        <el-table-column prop="follower" style="width: 30%">
        </el-table-column>
        <el-table-column prop="status">
          <template slot-scope="scope">
            <el-popover popper-class="popoverMinWidth" ref="popoverStatus" trigger="click">
              <el-row>
                <el-button type="text" v-show="scope.row.status !== 'Resolved'" @click="updateIssueStatus(scope.row, 'Resolved')">Resolved</el-button>
              </el-row>
              <el-row>
                <el-button type="text" v-show="scope.row.status !== 'Blocking'" @click="updateIssueStatus(scope.row, 'Blocking')">Blocking</el-button>
              </el-row>
              <el-row>
                <el-button type="text" v-show="scope.row.status !== 'Followup'" @click="updateIssueStatus(scope.row, 'Followup')">Followup</el-button>
              </el-row>
            </el-popover>
            <span v-popover:popoverStatus>{{scope.row.status}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
// import AddDialogContent from '@/components/AddPointDialogComponent';
import AddDialogContent from '@/components/AddBlockedDialogContent';
export default {
  components: { 'add-block-dialog': AddDialogContent },
  data () {
    return {
      issues: [{
        issueid: '111',
        issuekey: 'CDP-7111',
        ownergroup: 'CDP',
        follower: 'Tai',
        status: 'Blocking'
      }, {
        issueid: '222',
        issuekey: 'CDP-7222',
        ownergroup: 'CDP',
        follower: 'Tai',
        status: 'Resolved'
      }, {
        issueid: '333',
        issuekey: 'CDP-7333',
        ownergroup: 'CDP',
        follower: 'Tai',
        status: 'Resolved'
      }],
      currentblockersnum: 4,
      previousblockersnum: 5,
      dialogDisplay: false
    };
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      if (this.issues[rowIndex].status === 'Blocked') {
        return 'blockedIssueTrColor';
      } else if (this.issues[rowIndex].status === 'Resolved') {
        return 'resolvedIssueTrColor';
      } else if (this.issues[rowIndex].status === 'Followup') {
        return 'followupIssueTrColor';
      }
      return '';
    },
    updateIssueStatus (row, status) {
      row.status = status;
      if (status === 'Resolved') {
        this.currentblockersnum--;
        this.previousblockersnum++;
      }
    },
    openDialog: function () {
      this.dialogDisplay = true;
      var self = this;
      setTimeout(function () {
        self.dialogDisplay = null;
      });
    }
  },
  created: function () {},
  mounted: function () {}
};
</script>
<style lang="less">
@import '../css/globalDefine';
.blockSheetHeader {
  border-bottom: 1px solid @borderColor;
}

.addIssueIcon {
  color: @blueColor;
}
.textBold{
  font-size: 14px; font-weight:600;
}
.reducedIssueIcon,
.textSuccColor,
.resolvedIssueTrColor {
  color: @successColor;
}

.addedIssueIcon,
.textDangerColor,
.blockedIssueTrColor {
  color: @dangerColor;
}

.followupIssueTrColor {
  color: @warningColor;
}

.blockSheetSummary {
  border-bottom: 1px solid @borderColor;
  padding-bottom: 8px;
  margin-bottom: 12px;
}

.popoverMinWidth {
  min-width: 80px;
}

.popoverMinWidth .el-button--text {
  color: #606266;
}

</style>
