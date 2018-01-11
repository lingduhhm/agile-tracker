<template>
  <div class="story">
    test
  </div>
</template>

<script>
  export default {
    data () {
      return {
      };
    },
    created: function () {
      this.fetchData();
    },
    watch: {
      '$route': 'fetchData'
    },
    methods: {
      fetchData: function () {
        var objId = this.$route.params.category;
        console.log(objId);
        this.axios.get('/admin/stories/' + objId)
        .then(function () {})
        .catch(function (err) {
          console.log(err);
        });
      }
    }
  };
</script>

<style scoped>


</style>