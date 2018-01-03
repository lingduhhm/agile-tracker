/*
  author: onwebbe (tai)
*/
<template>
  <div class="dataSheet">
    <div>
      <point-status></point-status>
    </div>
    <div>
      <block-issues></block-issues>
    </div>
    <div>
      <followups></followups>
    </div>
  </div>
</template>

<script>
import PointStatus from '@/components/PointStatusInfoComponent';
import BlockIssues from '@/components/BlockIssuesInfoComponent';
import Followups from '@/components/FollowupInfoComponent';
export default {
  name: 'DataSheet',
  data () {
    return {
    };
  },
  created: function () {
  },
  mounted: function () {
  },
  components: {
    'point-status': PointStatus,
    'block-issues': BlockIssues,
    'followups': Followups
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dataSheet {
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
}
.dataSheet > div {
  flex-grow: 1;
  flex: flex-grow;
}
</style>
