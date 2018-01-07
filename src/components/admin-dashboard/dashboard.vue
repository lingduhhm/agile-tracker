<template>
  <el-row>
    <el-col :span="6">
      <sprint-card></sprint-card>
    </el-col>
  </el-row>
</template>

<script>
  import sprintCard from './sprintcard.vue';

  export default {
    data () {
      return {
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