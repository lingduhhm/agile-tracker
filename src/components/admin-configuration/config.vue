<template>
  <div>
    <el-row :gutter="20" class="rowMargin">
      <el-col :span="12">
        <group-card></group-card>
      </el-col>
      <el-col :span="12">
        <table-comp :configObj= "configObj" ></table-comp>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import groupCard from '../admin-common/groupCard.vue';
  import tableComp from '../admin-common/tableComp.vue';

  export default {
    data () {
      return {
        configObj: {
          title: 'User Map (Optional)',
          name: 'User Map',
          path: '/admin/usermaps/',
          columns: [
            {
              label: 'User Id',
              key: 'userid'
            },
            {
              label: 'Name',
              key: 'displayname'
            },
            {
              label: 'Capacity',
              key: 'capacity'
            }
          ]
        }
      };
    },
    created: function () {
    },
    watch: {
    },
    components: {
      'groupCard': groupCard,
      'tableComp': tableComp
    }
  };
</script>

<style scoped>
  .rowMargin{
    margin: 0 0 20px 0;
  }

</style>