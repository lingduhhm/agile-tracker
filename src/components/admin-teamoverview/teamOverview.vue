<template>
  <div>
    <el-row :gutter="20" class="rowMargin">
      <el-col :span="24" style="text-align:left;">
        <h1 style="border-bottom: 1px solid #C0C4CC;">Planning Sprint</h1>
      </el-col>
      <el-col :span="24">
        <planning-detail-card :sprintid="planningSprintId" :module="planningModel" ref="planningDetailCard"></planning-detail-card>
      </el-col>
      <el-col :span="24" style="text-align:left;">
        <h1 style="border-bottom: 1px solid #C0C4CC;">InProgress Sprint</h1>
      </el-col>
      <el-col :span="24">
        <progress-detail-card :sprintid="progressplanningSprintId" :module="progressModel" ref="progressDetailCard"></progress-detail-card>
      </el-col>
      <el-col :span="24" style="text-align:left;">
        <h1 style="border-bottom: 1px solid #C0C4CC;">Completed Sprint</h1>
      </el-col>
      <el-col :span="24">
        <el-row :gutter="20" class="rowMargin completedSprintCards">
          <el-col :span="8">
            <done-detail-card></done-detail-card>
          </el-col>
          <el-col :span="8">
            <done-detail-card></done-detail-card>
          </el-col>
          <el-col :span="8">
            <done-detail-card></done-detail-card>
          </el-col>
          <el-col :span="8">
            <done-detail-card></done-detail-card>
          </el-col>
          <el-col :span="8">
            <done-detail-card></done-detail-card>
          </el-col>
          <el-col :span="8">
            <done-detail-card></done-detail-card>
          </el-col>
          <el-col :span="8">
            <done-detail-card></done-detail-card>
          </el-col>
          <el-col :span="8">
            <done-detail-card></done-detail-card>
          </el-col>
        </el-row>  
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import progressDetailCard from '@/components/statusCard/ProgressDetailCard';
  import planningDetailCard from '@/components/statusCard/PlanningDetailCard';
  import doneCard from '@/components/statusCard/DoneCard';
  export default {
    data () {
      return {
        planningSprintId: '5aaf28397ebf77064ee6c051',
        planningModel: window.localStorage.getItem('module'),
        progressplanningSprintId: '5aa771aa565aac21dbe670d1',
        progressModel: window.localStorage.getItem('module')
      };
    },
    created: function () {
    },
    beforeRouteUpdate (to, from, next) {
      next(this.refreshData());
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.refreshData();
      });
    },
    mounted: function () {
      this.$refs.planningDetailCard.fetchData();
      this.$refs.progressDetailCard.fetchData();
    },
    methods: {
      refreshData () {
      }
    },
    components: {
      'progress-detail-card': progressDetailCard,
      'planning-detail-card': planningDetailCard,
      'done-detail-card': doneCard
    }
  };
</script>

<style scoped>
  .rowMargin{
    margin: 0 0 20px 0;
  }
  .completedSprintCards {
    margin-top: -20px;
  }

</style>