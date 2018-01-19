<template>
  <div>
    <el-row :gutter="20" class="rowMargin">
      <el-col :span="24">
        <group-card></group-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import groupCard from '../admin-common/groupCard.vue';

  export default {
    data () {
      return {
      };
    },
    created: function () {
    },
    watch: {
    },
    components: {
      'groupCard': groupCard
    }
  };
</script>

<style scoped>
  .rowMargin{
    margin: 0 0 20px 0;
  }

</style>