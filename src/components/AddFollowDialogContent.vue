<template>
  <div class="addPointDialogContainer">
    <div class="BISelectContainer">
      <el-dialog
        title="Add New Blocker"
        :visible.sync="dialogVisible"
        width="30%"
        @close="handleClose"
        class="addPointDialog">
        <el-alert style="margin: -20px 0px 20px 0px" title="The issue number and owner are required!" 
        type="warning" v-show="isShowAlert" @close="isShowAlert=false"></el-alert>
        <el-row>
          <el-col :span="4">
            <div class="grid-content">
              <span>Issue Number:&nbsp;</span>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content">
              <el-input v-model="issueAdded" placeholder="Please input BI"></el-input>
            </div>
          </el-col>
          <el-col :span="10" style="text-align: center">
            <a :href="'https://jira.successfactors.com/browse/'+issueAdded">{{issueAdded}}</a>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content">
              <span>Owner:&nbsp;</span>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content">
              <el-input v-model="ownerAdded" placeholder="Please input Owner"></el-input>
            </div>
          </el-col>
          <el-col :span="10" style="text-align: center">
            <span>{{ownerAdded}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content">
              <span>Comments:&nbsp;</span>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="grid-content">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="Please input your comments."
                v-model="comments">
              </el-input>
            </div>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="confirmCloseDialog">Confirm</el-button>
        </span>
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
    },
    'blockIssues': {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      issueAdded: '',
      ownerAdded: '',
      comments: '',
      isShowAlert: false,
      statusSelected: '',
      dialogVisible: false
    };
  },
  methods: {
    handleClose: function () {
      this.issueAdded = '';
      this.ownerAdded = '';
      this.comments = '';
    },
    confirmCloseDialog: function () {
      if (this.ownerAdded && this.issueAdded) {
        this.dialogVisible = false;
        this.isShowAlert = false;
        var newIssue = {
          issuekey: this.issueAdded,
          follower: this.ownerAdded,
          status: 'Blocking',
          comments: this.comments
        };
        this.$emit('blockIssueAdded', newIssue);
      } else {
        this.isShowAlert = true;
      }
    }
  },
  created: function () {
  },
  mounted: function () {
  },
  watch: {
    issueAdded: function () {
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
