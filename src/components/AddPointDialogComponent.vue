<template>
  <div class="addPointDialogContainer">
    <div class="BISelectContainer">
      <el-dialog
        title="Add Point Dialog"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        class="addPointDialog">
        <el-row>
          <el-col :span="15">
            <div class="grid-content">
              <el-select v-model="biSelected" filterable allow-create placeholder="Please select BI">
                <el-option
                  v-for="item in biList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="5"><div class="grid-content">{{biSelected}}&nbsp;</div></el-col>
          <el-col :span="4"><div class="grid-content">10 Point</div></el-col>
        </el-row>
        <el-row class="selections">
          <div class="grid-content">
            <el-radio v-model="statusSelected" :label="status.key" border size="medium" v-for="status in statusList" :key="status.key">{{status.label}}</el-radio>
          </div>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
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
        key: 'testcomplete',
        label: 'Test Complete'
      }]
    };
  },
  methods: {
    handleClose: function () {}
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
}
</style>
