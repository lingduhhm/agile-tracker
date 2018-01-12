<template>
  <div>
    <el-row>
      <el-col :span="6">
        <sprint-card></sprint-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import sprintCard from './sprintcard.vue';

  export default {
    data () {
      return {
        dialogVisible: false,
        title: 'Add',
        form: {}
      };
    },
    methods: {
    },
    components: {
      sprintCard
    }
  };
</script>

<style scoped>
</style>