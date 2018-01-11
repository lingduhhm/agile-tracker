<template>
  <div class="addPointDialogContainer">
    <div class="BISelectContainer">
      <el-dialog
        title="Add Point Dialog"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
        class="addPointDialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="grid-content">
          <el-form-item prop="biSelected" label="BI Number" class="addPointDialogContent">
            <el-row>
              <el-col :span="15">
              <el-select v-model="ruleForm.biSelected" filterable allow-create placeholder="Please select BI">
                <el-option
                  v-for="item in biList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              </el-col>
              <el-col :span="5">
                <div><a target="_blank" :href='biSelectedURL'>{{ruleForm.biSelected}}</a>&nbsp;</div>
              </el-col>
              <el-col :span="4"><div>10 Point</div></el-col>
            </el-row>
          </el-form-item>
          <el-form-item prop="statusSelected" class="addPointDialogContent">
            <el-radio-group v-model="ruleForm.statusSelected">
              <el-radio :label="status.key" border size="medium" v-for="status in statusList" :key="status.key">{{status.label}}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="addPointDialogFooter">
            <el-button type="primary" @click="dialogVisible = false">Cancel</el-button>
            <el-button @click="submitForm('ruleForm')">Confirm</el-button>
          </el-form-item>
        </el-form>
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
      biSelectedURL: '',
      biList: [{
        value: 'CDP-8411',
        label: 'CDP-8411'
      }, {
        value: 'CDP-8412',
        label: 'CDP-8412'
      }, {
        value: 'CDP-8413',
        label: 'CDP-8413'
      }, {
        value: 'CDP-8414',
        label: 'CDP-8414'
      }],
      dialogVisible: false,
      statusList: [{
        key: 'devcomplete',
        label: 'Dev Complete'
      }, {
        key: 'testcomplete',
        label: 'Test Complete'
      }],
      ruleForm: {
        biSelected: '',
        statusSelected: ''
      },
      rules: {
        biSelected: [
          { required: true, message: 'please enter story id', trigger: 'change' }
        ],
        statusSelected: [
          { required: true, message: 'please select option', trigger: 'change' }
        ]
      }
    };
  },
  methods: {
    handleClose: function () {},
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
          this.ruleForm.biSelected = '';
          this.dialogVisible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  created: function () {
  },
  mounted: function () {
  },
  computed: {
    biSelected () {
      return this.ruleForm.biSelected;
    }
  },
  watch: {
    biSelected: function (newValue) {
      this.biSelectedURL = 'https://jira.successfactors.com/browse/' + newValue;
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
.addPointDialogContainer .addPointDialogContent {
  margin-bottom: 40px;
}
.addPointDialogFooter {
  text-align: right;
  margin-bottom: 0px;
}
</style>
