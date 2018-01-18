<template>
  <el-container>
    <el-header class="pointStatus" style="height: 40px;">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="12">
          <span class="pointInfoTitle">Block issues</span>
        </el-col>
        <el-col :span="6">
          <i class="el-icon-circle-plus-outline addIssueIcon" @click="openDialog"></i>
          <add-block-dialog :dialogDisplay="dialogDisplay" :blockIssues="issues" 
          @blockIssueAdded="addBlockFromDialog"></add-block-dialog>
        </el-col>
      </el-row>
    </el-header>
    <el-main style="padding:0px">
       <div class="pointChangedHis">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="9">
            <i class="el-icon-caret-bottom successContent"></i>
            <span class="successContent">{{getReducedBlockNum}}</span>
          </el-col>
          <el-col :span="9">
            <i class="el-icon-caret-top blockContent"></i>
            <span class="blockContent">{{getAddBlockNum}}</span>
          </el-col>
        </el-row>
        <el-row style="height: 30px;line-height: 30px;padding-left: 20px">
          <el-col :span="12">
            <span class="pointInfoTitle">Today Blockers：</span>
          </el-col>
          <el-col :span="6">
            <span class="textDangerColor">{{getCurrentBlockersNum}}</span>
          </el-col>
        </el-row>
        <el-row style="height: 30px;line-height: 30px;padding-left: 20px">
          <el-col :span="12">
            <span class="pointInfoTitle">Last Day Blockers：</span>
          </el-col>
          <el-col :span="6">
            <span class="textDangerColor">{{getPreviousBlockersnum}}</span>
          </el-col>
        </el-row>
      </div>
      <div class="pointChangedItem">
         <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="9">
            <span class="pointInfoTitle">Issues ({{issues.length}})</span>
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
            <el-popover popper-class="popoverMinWidth" ref="popoverStatus" trigger="click">
              <el-row>
                <el-button type="text" v-show="scope.row.status !== 'Resolved'" @click="updateIssueStatus(scope.row, 'Resolved')">Resolved</el-button>
              </el-row>
              <el-row>
                <el-button type="text" v-show="scope.row.status !== 'Open'" @click="updateIssueStatus(scope.row, 'Open')">Blocking</el-button>
              </el-row>
              <el-row>
                <el-button type="text" v-show="scope.row.status !== 'Followup'" @click="updateIssueStatus(scope.row, 'Followup')">Followup</el-button>
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
import AddDialogContent from '@/components/AddBlockedDialogContent';
export default {
  components: { 'add-block-dialog': AddDialogContent },
  data () {
    return {
      issues: [],
      previousIssues: [],
      currentblockersnum: 0,
      previousblockersnum: 0,
      dialogDisplay: false,
      isShowAll: true
    };
  },
  methods: {
    updateBlockData (data) {
      var dayLength = data.resData.summary.length - 1;
      this.$root.eventHub.$emit('getDaySummary', dayLength, 'QA', data.resData.summary[dayLength], data.resData.summary[dayLength - 1]);
    },
    tableRowClassName ({row, rowIndex}) {
      if (this.issues) {
        if (this.issues[rowIndex].status === 'Open') {
          return 'blockedIssueTrColor';
        } else if (this.issues[rowIndex].status === 'Resolved') {
          return 'resolvedIssueTrColor';
        }
      }
      return '';
    },
    updateIssueStatus (row, status) {
      row.status = status;
    },
    changeShowAll: function () {
      this.isShowAll = !this.isShowAll;
    },
    openDialog: function () {
      this.dialogDisplay = true;
      var self = this;
      setTimeout(function () {
        self.dialogDisplay = null;
      });
    },
    addBlockFromDialog: function (data) {
      this.issues.unshift(data);
    },
    getDayBlockSummary: function (day, clickedGroup, todayData, previousData) {
      console.log(arguments);
      this.issues = todayData.groups[clickedGroup].blocker || [];
      this.previousIssues = previousData.groups[clickedGroup].blocker || [];
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
    getCurrentBlockersNum: function () {
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
    getPreviousBlockersnum: function () {
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
    getAddBlockNum: function () {
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
    getReducedBlockNum: function () {
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
      this.$root.eventHub.$on('sprintChanged', this.updateBlockData);
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
