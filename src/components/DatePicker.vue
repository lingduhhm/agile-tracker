/*
  author: onwebbe (tai)
*/

<template>
  <div class="DatePicker">
    <div class="calendarHeader">
      <div class="headerLeftArrow" @click="prevMonth">
        <span v-if="isHavePrevMonth"><</span>
      </div>
      <div class="header">
        {{displayYear}} - {{displayMonth + 1}}
      </div>
      <div class="headerLeftArrow" @click="nextMonth">
        <span v-if="isHaveNextMonth">></span>
      </div>
    </div>
    <div class="calendarText">
      <div class="calendarRow">
        <div class="calendarCell weekend">日</div>
        <div class="calendarCell">一</div>
        <div class="calendarCell">二</div>
        <div class="calendarCell">三</div>
        <div class="calendarCell">四</div>
        <div class="calendarCell">五</div>
        <div class="calendarCell weekend">六</div>
      </div>
    </div>
    <div class="calendarBody">
      <div class="calendarRow" v-for="(rowItem, rowIdx) in displayCalendar" v-if="!(rowItem[0].character==='' && rowIdx>1)">
        <div class="calendarCell" v-for="(cellItem, colIdx) in rowItem" :celldisabled="cellItem.disabled" :rowIdx="rowIdx" :colIdx="colIdx" @click="cellClicked(rowIdx, colIdx, cellItem);" :class="{weekend: cellItem.weekend, selected: cellItem.selected, disabled: cellItem.disabled}">
          {{cellItem.character}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  props: {
    dateSelected: {
      type: Array,
      default: ['2017-12-20', '2017-12-26']
    },
    'startDate': {
      type: String,
      default: '2017-11-10'
    },
    'endDate': {
      type: String,
      default: '2018-03-03'
    }
  },
  data () {
    return {
      'displayCalendar': [],
      'displayYear': new Date().getFullYear(),
      'displayMonth': new Date().getMonth(),
      'calendarDateSelected': []
    };
  },
  methods: {
    nextMonth: function () {
      this.displayMonth = this.displayMonth + 1;
      if (this.displayMonth >= 12) {
        this.displayYear += 1;
        this.displayMonth = this.displayMonth - 12;
      }
      this.calculateMonthCalendar(this.displayYear, this.displayMonth);
    },
    prevMonth: function () {
      this.displayMonth = this.displayMonth - 1;
      if (this.displayMonth < 0) {
        this.displayYear -= 1;
        this.displayMonth = this.displayMonth + 12;
      }
      this.calculateMonthCalendar(this.displayYear, this.displayMonth);
    },
    cellClicked: function (rowIdx, colIdx, rowItem) {
      var cellDisabled = rowItem.disabled;
      if (!cellDisabled) {
        var dayCharacter = rowItem.character;
        var selected = this.displayCalendar[rowIdx][colIdx].selected;
        this.displayCalendar[rowIdx][colIdx].selected = !selected;
        // var dateString = this.displayYear + '-' + (this.displayMonth + 1) + '-' + dayCharacter;
        var monthStr = this.displayMonth + 1;
        monthStr = monthStr + '';
        monthStr = monthStr.length > 1 ? monthStr : '0' + monthStr;
        var dayCharacterStr = dayCharacter + '';
        dayCharacterStr = dayCharacterStr.length > 1 ? dayCharacterStr : ('0' + dayCharacterStr);
        var dateString = this.displayYear + '-' + monthStr + '-' + dayCharacterStr;
        if (!selected) {
          this.addDate(dateString);
        } else {
          this.removeDate(dateString);
        }
      }
    },
    addDate: function (dateStr) {
      if (this.dateSelectedMap[dateStr] !== true) {
        this.calendarDateSelected.push(dateStr);
      }
    },
    removeDate: function (dateStr) {
      for (var i = 0; i < this.calendarDateSelected.length; i++) {
        var dateSelectedItem = this.calendarDateSelected[i];
        if (dateStr === dateSelectedItem) {
          this.calendarDateSelected.splice(i, 1);
          i = i - 1;
        }
      }
    },
    calculateMonthCalendar: function (year, month) {
      console.log(this.startDate);
      var startDateObj = new Date(this.startDate + ' 00:00:00');
      var endDateObj = new Date(this.endDate + ' 00:00:00');

      var date = new Date(year, month, 1);
      var startDay = date.getDay();
      var dayCharacter = 1;

      var tmpDate = new Date(year, month + 1, 1);
      tmpDate = new Date(tmpDate - 1);
      var lastDayOfTheMonth = tmpDate.getDate();
      for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 7; j++) {
          var cellItem = this.displayCalendar[i][j];
          if (i === 0 && j < startDay) {
            cellItem.character = '';
            cellItem.dateObj = null;
            cellItem.disabled = true;
            cellItem.selected = false;
          } else {
            if (dayCharacter <= lastDayOfTheMonth) {
              cellItem.disabled = false;

              var monthStr = month + 1;
              monthStr = monthStr + '';
              monthStr = monthStr.length > 1 ? monthStr : '0' + monthStr;
              var dayCharacterStr = dayCharacter + '';
              dayCharacterStr = dayCharacterStr.length > 1 ? dayCharacterStr : ('0' + dayCharacterStr);
              var dateString = year + '-' + monthStr + '-' + dayCharacterStr;

              cellItem.dateObj = new Date(year + '-' + monthStr + '-' + dayCharacter + ' 00:00:00');
              cellItem.character = dayCharacter++;
              if (j === 0 || j === 6) {
                cellItem.weekend = true;
              }
              if (this.dateSelectedMap[dateString] === true) {
                cellItem.selected = true;
              } else {
                cellItem.selected = false;
              }

              console.log(cellItem.dateObj + ':' + startDateObj + ':' + endDateObj);
              if (cellItem.dateObj < startDateObj || cellItem.dateObj > endDateObj) {
                cellItem.disabled = true;
              }

            } else {
              cellItem.character = '';
              cellItem.dateObj = null;
              cellItem.disabled = true;
              cellItem.selected = false;
            }
          }
        }
      }
    }
  },
  created: function () {
    for (var i = 0; i < 6; i++) {
      var rowData = [];
      for (var j = 0; j < 7; j++) {
        var cellItem = {
          selected: false,
          disabled: false,
          weekend: false,
          character: '',
          dateObj: null
        };
        rowData.push(cellItem);
      }
      this.displayCalendar.push(rowData);
    }
    this.calculateMonthCalendar(this.displayYear, this.displayMonth);
  },
  mounted: function () {
    $('.DatePicker .calendarRow .calendarCell').hover(function () {
      if ($(this).attr('celldisabled') !== 'true' && !$(this).hasClass('selected')) {
        $(this).addClass('hover');
      }
    }, function () {
      $(this).removeClass('hover');
    });
  },
  updated: function () {
    $('.DatePicker .calendarRow .calendarCell').hover(function () {
      if ($(this).attr('celldisabled') !== 'true' && !$(this).hasClass('selected')) {
        $(this).addClass('hover');
      }
    }, function () {
      $(this).removeClass('hover');
    });
  },
  computed: {
    daysSelectedInCalendar: function () {
      var list = [];
      for (let item in this.dateSelectedMap) {
        list.push(item);
      }
      return list;
    },
    isHaveNextMonth: function () {
      // var startDateObj = new Date(this.startDate);
      var endDateObj = new Date(this.endDate);
      // var startMonth = startDateObj.getMonth();
      var endMonth = endDateObj.getMonth();
      // var startYear = startDateObj.getFullYear();
      var endYear = endDateObj.getFullYear();

      if (this.displayYear < endYear) {
        return true;
      } else if (this.displayMonth < endMonth) {
        return true;
      }
      return false;
    },
    isHavePrevMonth: function () {
      var startDateObj = new Date(this.startDate);
      // var endDateObj = new Date(this.endDate);
      var startMonth = startDateObj.getMonth();
      // var endMonth = endDateObj.getMonth();
      var startYear = startDateObj.getFullYear();
      // var endYear = endDateObj.getFullYear();

      if (this.displayYear > startYear) {
        return true;
      } else if (this.displayMonth > startMonth) {
        return true;
      }
      return false;
    },
    dateSelectedMap: function () {
      var theMap = {};
      for (var i = 0; i < this.dateSelected.length; i++) {
        var dateSelectedItem = this.dateSelected[i];
        theMap[dateSelectedItem] = true;
      }
      return theMap;
    }
  },
  components: {
  },
  watch: {
    dateSelected: function () {
      this.calendarDateSelected = this.dateSelected;
      this.calculateMonthCalendar(this.displayYear, this.displayMonth);
    },
    calendarDateSelected: function () {
      if (this.$root.eventHub) {
        this.$root.eventHub.$emit('datePickerChanged', this.calendarDateSelected);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import '../css/globalDefine';
.DatePicker .calendarHeader .headerLeftArrow {
  display: inline-block;
  width: 20px;
  text-align: center;
}
.DatePicker .calendarHeader .headerLeftArrow {
  display: inline-block;
  width: 20px;
}
.DatePicker .calendarHeader .header {
  display: inline-block;
  width: calc( 100% - 40px );
  text-align: center;
}
.DatePicker .calendarRow {
  width: 100%;
  display: flex;
  border-bottom: 1px solid black;
  padding: 2px 0px;
}
.DatePicker .calendarRow .calendarCell {
  text-align: center;
  width: 14.2%;
  min-height: 30px;
  line-height: 30px;
  padding: 5px 0px;
  margin-left: 2px;
  border-radius: 20px;
}
.DatePicker .calendarRow .weekend,
.DatePicker .calendarRow .disabled.weekend {
  color: red;
}
.DatePicker .calendarRow .selected {
  background-color: #409eff;
  opacity: 0.8;
}
.DatePicker .calendarRow .disabled {
  color: #c0c4cc;
}
.DatePicker .calendarRow .hover {
  background-color: #f2f6fc;
}

</style>
