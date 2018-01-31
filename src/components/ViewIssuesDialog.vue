<template>
  <div class="viewIssuesDialogContainer">
    <div class="viewIssuesContainer">
      <el-dialog title="Add New Blocker" :visible.sync="dialogVisible" width="30%" @open="getRootData" class="addPointDialog">
        <template>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="issueKey"
              label="Issue Key"
              width="180">
            </el-table-column>
             <el-table-column
              prop="category"
              label="Category">
            </el-table-column>
            <el-table-column
              prop="ingroup"
              label="Group"
              width="180">
            </el-table-column>
          </el-table>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
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
    'userStoryId': String,
    'day': String,
    'group': String
  },
  data () {
    return {
      groupList: [],
      dialogVisible: false,
      tableData: []
    };
  },
  methods: {
    getRootData: function () {
      this.groupList = this.$root.allGroups;
      var todayItem = this.$root.getDayDataDay(parseInt(this.day));
      var allIssues = [];
      let groupData = todayItem.groups[this.group];
      if (groupData == null) {
        return;
      }
      let blocker = groupData.blocker;
      let followup = groupData.followup;
      if (blocker != null) {
        allIssues = allIssues.concat(blocker);
      }
      if (followup != null) {
        allIssues = allIssues.concat(followup);
      }
      this.tableData = allIssues;
    }
  },
  created: function () {

  },
  mounted: function () {

  },
  watch: {
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
.viewIssuesDialogContainer .selections {
  /*margin-top: 20px;*/
}


.viewIssuesContainer a {
  text-decoration: none;
}

</style>
