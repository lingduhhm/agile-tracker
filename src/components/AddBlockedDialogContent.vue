<template>
  <div class="addPointDialogContainer">
    <div class="BISelectContainer">
      <el-dialog
        title="Add New Blocker"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        class="addPointDialog">
        <el-alert style="margin: -20px 0px 20px 0px" title="The issue number and owner are required!" 
        type="warning" v-show="isShowAlert" @close="isShowAlert=false"></el-alert>
        <el-row>
          <el-col :span="4">
            <div class="grid-content">
              <span>Issue Number:&nbsp;</span>
            </div>
          </el-col>
          <el-col :span="15">
            <div class="grid-content">
              <el-select v-model="biSelected" filterable clearable allow-create placeholder="Please select BI">
                <el-option
                  v-for="item in biList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="5">
            <a href="#">{{biSelected}}</a>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="grid-content">
              <span>Owner:&nbsp;</span>
            </div>
          </el-col>
          <el-col :span="15">
            <div class="grid-content">
              <el-select v-model="ownerSelected" filterable clearable allow-create placeholder="Please select owner">
                <el-option
                  v-for="item in ownerList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userName">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="5">
            <a href="#">{{ownerSelected}}</a>
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
                placeholder=""
                v-model="commentsContent">
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
    }
  },
  data () {
    return {
      biSelected: '',
      ownerSelected: '',
      isShowAlert: false,
      biList: [{
        value: 'BI-3131',
        label: 'BI-3131'
      }, {
        value: 'BI-3132',
        label: 'BI-3132'
      }, {
        value: 'BI-3133',
        label: 'BI-3133'
      }, {
        value: 'BI-3134',
        label: 'BI-3134'
      }],
      statusSelected: '',
      dialogVisible: false,
      statusList: [{
        key: 'devcomplete',
        label: 'Dev Complete'
      }, {
        key: 'blocked',
        label: 'Blocked'
      }, {
        key: 'testcomplete',
        label: 'Test Complete'
      }, {
        key: 'add',
        label: 'Add'
      }],
      ownerList: [{
        userId: 'admin1',
        userName: 'cgrant1'
      }, {
        userId: 'admin2',
        userName: 'cgrant2'
      }],
      commentsContent: ''
    };
  },
  methods: {
    handleClose: function () {},
    confirmCloseDialog: function () {
      if (this.ownerSelected && this.biSelected) {
        this.dialogVisible = false;
        this.isShowAlert = false;
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
    biSelected: function () {
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
