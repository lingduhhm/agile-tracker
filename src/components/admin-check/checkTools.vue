<template>
  <div>
    <el-tabs type="card" v-model="activeTab">
      <el-tab-pane key="checkstories" label="Open Stories Check" name="checkstories">
        <story-check></story-check>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import storyCheck from '@/components/admin-check/storyCheck';
  export default {
    data () {
      return {
        activeTab: 'checkstories'
      };
    },
    components: {
      'storyCheck': storyCheck
    }
  };
</script>

<style scoped>
</style>