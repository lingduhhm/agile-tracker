<template>
  <el-container>
    <el-header class="pointStatus" style="height: 40px;">
      <el-row type="flex" class="row-bg" justify="space-around">
        <el-col :span="12">
          <span class="pointInfoTitle">Block issues</span>
        </el-col>
        <el-col :span="6">
          <i class="el-icon-circle-plus-outline addIssueIcon"  v-show="isShowAction" @click="openDialog"></i>
          <add-block-dialog :dialogDisplay="dialogDisplay" category="block"></add-block-dialog>
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
          <el-col :span="10">
            <span class="textDangerColor">{{getCurrentBlockersNum}}</span>
          </el-col>
        </el-row>
        <el-row style="height: 30px;line-height: 30px;padding-left: 20px">
          <el-col :span="12">
            <span class="pointInfoTitle">Last Day Blockers：</span>
          </el-col>
          <el-col :span="10">
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
        <el-table :data="filterIssues" :show-header=false  :row-class-name="tableRowClassName"   max-height="300"  style="width: 100%">
        <el-table-column prop="issuekey" style="width: 30%">
        </el-table-column>
        <el-table-column prop="follower" style="width: 30%">
        </el-table-column>
        <el-table-column prop="status">
          <template slot-scope="scope">
            <el-popover popper-class="popoverMinWidth" ref="popoverStatus" trigger="click" :disabled = "!isShowAction" v-model="popoverdisplay">
              <el-row>
                <el-button type="text" v-show="scope.row.status !== 'Resolved'" @click="updateIssueStatus(scope.row, 'Resolved')">Resolved</el-button>
              </el-row>
              <el-row>
                <el-button type="text" v-show="scope.row.status !== 'Open'" @click="updateIssueStatus(scope.row, 'Open')">Blocking</el-button>
              </el-row>
              <el-row>
                <el-button type="text" @click="updateIssueCategory(scope.row, 'followup')">Followup</el-button>
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
import AddDialogContent from '@/components/AddIssueDialog';
export default {
  components: { 'add-block-dialog': AddDialogContent },
  data () {
    return {
      isShowAction: false,
      issues: [],
      previousIssues: [],
      currentblockersnum: 0,
      previousblockersnum: 0,
      dialogDisplay: false,
      isShowAll: true,
      popoverdisplay: false
    };
  },
  methods: {
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
    updateIssueCategory (row, category) {
  //     var formData = req.body;
  // var sprintid = formData.sprintid;
  // var issueid = formData.issueid; // The Object id for the issue
  // var changereason = formData.changereason; // reason of the change
  // var changefield = formData.changefield; // field name
  // var dataafterchange = formData.dataafterchange;
  // var changeinsprintday = formData.changeinsprintday; // 10
      var sprint = this.$root.sprintSelected._id;
      var changeinsprintday = this.$root.summary.summary.length - 1;
      var updateInfo = {
        sprintid: sprint,
        issueid: row._id,
        changefield: 'category',
        dataafterchange: category,
        changeinsprintday: changeinsprintday
      };
      var self = this;
      this.axios.post('/api/v1/updateIssue', updateInfo).then(function (response) {
        self.popoverdisplay = false;
        if (response.data.status === 'success') {
          self.$root.eventHub.$emit('sprintDataChanged');
          // row.status = status;
        } else {
          self.$message({
            message: response.data.resMsg,
            type: 'error'
          });
        }
      }).catch(function (error) {
        self.popoverdisplay = false;
        console.log(error);
        self.$message({
          message: 'Server Error',
          type: 'error'
        });
      });
    },
    updateIssueStatus (row, status) {
  //     var formData = req.body;
  // var sprintid = formData.sprintid;
  // var issueid = formData.issueid; // The Object id for the issue
  // var changereason = formData.changereason; // reason of the change
  // var changefield = formData.changefield; // field name
  // var dataafterchange = formData.dataafterchange;
  // var changeinsprintday = formData.changeinsprintday; // 10
      var sprint = this.$root.sprintSelected._id;
      var changeinsprintday = this.$root.summary.summary.length - 1;
      var updateInfo = {
        sprintid: sprint,
        issueid: row._id,
        changefield: 'status',
        dataafterchange: status,
        changeinsprintday: changeinsprintday
      };
      var self = this;
      this.axios.post('/api/v1/updateIssue', updateInfo).then(function (response) {
        self.popoverdisplay = false;
        if (response.data.status === 'success') {
          self.$root.eventHub.$emit('sprintDataChanged');
          // row.status = status;
        } else {
          self.$message({
            message: response.data.resMsg,
            type: 'error'
          });
        }
      }).catch(function (error) {
        self.popoverdisplay = false;
        console.log(error);
        self.$message({
          message: 'Server Error',
          type: 'error'
        });
      });
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
    getDayBlockSummary: function (day, clickedGroup, todayData, previousData) {
      let calGroups = [clickedGroup];
      if (clickedGroup === '') {
        let allGroups = this.$root.allGroups;
        calGroups = [];
        for (var i = 0; i < allGroups.length; i++) {
          calGroups.push(allGroups[i].groupname);
        }
      }
      var blockers = [];
      var prevBlocker = [];
      for (let i = 0; i < calGroups.length; i++) {
        var usingGroup = calGroups[i];
        var dayLength = this.$root.summary.summary.length - 1;
        if (day === dayLength) {
          this.isShowAction = true;
        } else {
          this.isShowAction = false;
        }
        blockers = blockers.concat(todayData.groups[usingGroup].blocker || []);
        prevBlocker = prevBlocker.concat(previousData.groups[usingGroup].blocker || []);
      }
      this.issues = blockers;
      this.previousIssues = prevBlocker;
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
