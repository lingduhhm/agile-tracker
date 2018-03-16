/*
  author: onwebbe (tai)
*/

<template>
  <div class="breakdownLayer">
    <transition name="scale" v-on:after-enter="fetchData">
      <div class="breakDownLayerContainer" v-if="isDisplay">
        <break-down-main></break-down-main>
        <div class="el-icon-error breakDownLayerClose" @click="closeLayer"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import BreakDownMainPage from '../MainPage';

export default {
  components: {
    'break-down-main': BreakDownMainPage
  },
  props: {
    'sprintid': {
      type: String,
      default: '5aa771aa565aac21dbe670d1'
    },
    'layerDisplay': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isDisplay: false,
      allGroups: null,
      summary: null
    };
  },
  methods: {
    closeLayer () {
      this.isDisplay = false;
    },
    fetchData (inSprintId) {
      var self = this;
      //if (inSprintId === this.sprintid) {
      if (true) {
        var sprintid = this.sprintid;
        this.axios.get('/api/v1/getGroups?sprintid=' + sprintid).then(function (groupsData) {
          self.allGroups = groupsData.data.resData;
          self.axios.get('/api/v1/summary?sprintid=' + sprintid).then(function (summarydata) {
            self.summary = summarydata.data.resData;
            if (self.$root.eventHub) {
              self.$root.eventHub.$emit('sprintChanged', summarydata.data, self.allGroups, self.sprintid);
            }
          });
        });
      }
    }
  },
  created: function () {
    var self = this;
    if (this.$root.eventHub) {
      this.$root.eventHub.$on('sprintDataChanged', function (params) {
        self.fetchData();
      });
    }
  },
  mounted: function () {
  },
  watch: {
    layerDisplay: function () {
      if (!this.isDisplay) {
        this.isDisplay = this.layerDisplay;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.breakDownLayerContainer {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 100;
  left: 0px;
  top: 0px;
}
.breakDownLayerClose {
  width: 30px;
  height: 30px;
  position: fixed;
  top: 5px;
  right: 5px;
  font-size: 1.5rem;
  color: red;
}
@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.scale-enter-active {
  animation: scale-in .3s;
}
.scale-leave-active {
  animation: scale-in .3s reverse;
}
.scale-enter, .scale-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: scale(0);
  opacity: 0;
}

</style>
