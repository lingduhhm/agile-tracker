<template>
  <el-container>
    <el-header class="pointStatus" style="height: 40px;">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="12">
          <span class="pointInfoTitle">Followup issues</span>
        </el-col>
        <el-col :span="6">
          <i class="el-icon-circle-plus-outline addIssueIcon"  v-show="isShowAction" @click="openDialog"></i>
          <add-block-dialog :dialogDisplay="dialogDisplay" :followupIssues="issues" category="followup"></add-block-dialog>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="padding:0px">
       <div class="pointChangedHis">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="9">
            <i class="el-icon-caret-bottom successContent"></i>
            <span class="successContent">{{getReducedFollowupNum}}</span>
          </el-col>
          <el-col :span="9">
            <i class="el-icon-caret-top blockContent"></i>
            <span class="blockContent">{{getAddFollowupNum}}</span>
          </el-col>
        </el-row>
        <el-row style="height: 30px;line-height: 30px;padding-left: 20px">
          <el-col :span="12">
            <span class="pointInfoTitle">Today Followups：</span>
          </el-col>
          <el-col :span="10">
            <span class="textDangerColor">{{getCurrentFollowupNum}}</span>
          </el-col>
        </el-row>
        <el-row style="height: 30px;line-height: 30px;padding-left: 20px">
          <el-col :span="12">
            <span class="pointInfoTitle">Last Day Followups：</span>
          </el-col>
          <el-col :span="10">
            <span class="textDangerColor">{{getPreviousFollowupnum}}</span>
          </el-col>
        </el-row>
      </div>
      <div class="pointChangedItem">
         <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="9">
            <span class="pointInfoTitle">Follows ({{issues.length}})</span>
          </el-col>
           <el-col :span="9">
          <span>Show All</span>
          <el-switch v-model="isShowAll" active-color="#13ce66">
          </el-switch>
        </el-col>
        </el-row>
        <el-table :data="filterIssues"
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
            <el-popover popper-class="popoverMinWidth" ref="popoverStatus" trigger="click" :disabled = "!isShowAction">
              <el-row>
                <el-button type="text" v-show="scope.row.status !== 'Resolved'" @click="updateIssueStatus(scope.row, 'Resolved')">Resolved</el-button>
              </el-row>
              <el-row>
                <el-button type="text" v-show="scope.row.status !== 'Open'" @click="updateIssueStatus(scope.row, 'Open')">Followup</el-button>
              </el-row>
              <el-row>
                <el-button type="text"  @click="updateIssueStatus(scope.row, 'Followup')">Blocking</el-button>
              </el-row>
            </el-popover>
            <span v-popover:popoverStatus>{{scope.row.status}}</span>
          </template>
        </el-table-column>
      </el-table>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import AddDialogContent from '@/components/AddFollowDialogContent';
export default {
  components: { 'add-block-dialog': AddDialogContent },
  data () {
    return {
      isShowAction: true,
      issues: [],
      previousIssues: [],
      currentfollowupnum: 0,
      previousfollowupnum: 0,
      dialogDisplay: false,
      isShowAll: true
    };
  },
  methods: {
    tableRowClassName ({row, rowIndex}) {
      if (this.issues) {
        if (this.issues[rowIndex].status === 'Open') {
          return 'followupIssueTrColor';
        } else if (this.issues[rowIndex].status === 'Resolved') {
          return 'resolvedIssueTrColor';
        }
      }
      return '';
    },
    updateIssueStatus (row, status) {
      row.status = status;
    },
    openDialog: function () {
      this.dialogDisplay = true;
      var self = this;
      setTimeout(function () {
        self.dialogDisplay = null;
      });
    },
    getDayBlockSummary: function (day, clickedGroup, todayData, previousData) {
      console.log(arguments);
      var dayLength = this.$root.summary.summary.length - 1;
      if (day === dayLength) {
        this.isShowAction = true;
      } else {
        this.isShowAction = false;
      }
      this.issues = todayData.groups[clickedGroup].followup || [];
      this.previousIssues = previousData.groups[clickedGroup].followup || [];
    }
  },
  computed: {
    filterIssues: function () {
      if (this.isShowAll) {
        return this.issues;
      } else {
        return this.issues.filter(function (item) {
          return item.status === 'Open';
        });
      }
    },
    getCurrentFollowupNum: function () {
      var num = 0;
      if (this.issues) {
        for (var i = 0; i < this.issues.length; i++) {
          var issue = this.issues[i];
          if (issue.status === 'Open') {
            num++;
          }
        }
      };
      return num;
    },
    getPreviousFollowupnum: function () {
      var num = 0;
      if (this.previousIssues) {
        for (var i = 0; i < this.previousIssues.length; i++) {
          var issue = this.previousIssues[i];
          if (issue.status === 'Open') {
            num++;
          }
        }
      };
      return num;
    },
    getAddFollowupNum: function () {
      var num = 0;
      for (var i = 0; i < this.issues.length; i++) {
        var currentIssue = this.issues[i];
        if (currentIssue.status !== 'Open') {
          continue;
        } else {
          var flag = true;
          if (this.previousIssues) {
            for (var j = 0; j < this.previousIssues.length; j++) {
              var previousIssue = this.previousIssues[j];
              if (currentIssue.issuekey === previousIssue.issuekey) {
                flag = false;
                if (previousIssue.status === 'Resolved') {
                  num++;
                }
              }
            }
            if (flag) {
              num++;
            }
          } else {
            num++;
          }
        }
      }
      return num;
    },
    getReducedFollowupNum: function () {
      var num = 0;
      for (var i = 0; i < this.issues.length; i++) {
        var currentIssue = this.issues[i];
        if (currentIssue.status !== 'Resolved') {
          continue;
        } else {
          if (this.previousIssues) {
            for (var j = 0; j < this.previousIssues.length; j++) {
              var previousIssue = this.previousIssues[j];
              if (currentIssue.issuekey === previousIssue.issuekey) {
                if (previousIssue.status !== 'Resolved') {
                  num++;
                }
              }
            }
          }
        }
      }
      return num;
    }
  },
  created: function () {
    if (this.$root.eventHub) {
      console.log(this.$route);
      this.$root.eventHub.$on('getDaySummary', this.getDayBlockSummary);
    }
  },
  mounted: function () {}
};
</script>
<style lang="less">
@import '../css/globalDefine';
.blockSheetHeader {
  border-bottom: 1px solid @borderColor;
}

.addIssueIcon{
  color: @blueColor;
}
.resolvedIssueTrColor {
  color: @successColor;
}

.textDangerColor,
.blockedIssueTrColor {
  color: @dangerColor;
}

.popoverMinWidth {
  min-width: 80px;
  padding: 6px;
  text-align: center;
}
.followupIssueTrColor{
  color: @warningColor;
}
.popoverMinWidth .el-button--text {
  color: #606266;
}

header.pointStatus {
  line-height: 25px;
  padding: 0;
}
.pointStatus i{
  font-size: 24px;
}
.pointInfoTitle{
  display: block;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
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
</style>
