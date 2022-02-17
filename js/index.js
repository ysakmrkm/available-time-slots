var AvailableTimeSlots;

AvailableTimeSlots = class AvailableTimeSlots {
  constructor(target, options) {
    this.prevHtml = '<div id="ats-prev-week" class="ats-nav__item"><</div>';
    this.nextHtml = '<div id="ats-next-week" class="ats-nav__item">></div>';
    this.defaults = {
      availabileTimeSlots: [[], [], [], [], [], [], []],
      isMultiple: false,
      prevHtml: this.prevHtml,
      nextHtml: this.nextHtml,
      selectedDates: [],
      startDate: new Date(),
      slotSpan: 30,
      businessHour: [0, 23],
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      weekdays: ['日', '月', '火', '水', '木', '金', '土']
    };
    this.settings = Object.assign({}, this.defaults, options);
    this.startNum = (this.settings.businessHour[0] * 60) / this.settings.slotSpan;
    this.endNum = (this.settings.businessHour[1] * 60) / this.settings.slotSpan;
    this.onClick = this.settings.onClick;
    this.onClickNavigator = this.settings.onClickNavigator;
    this.target = target;
  }

  setDate(days) {
    var date;
    date = new Date(this.settings.startDate.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  getYearName(year) {
    return year + '年';
  }

  getMonthName(index) {
    return this.settings.months[index];
  }

  formatDate(data) {
    var date, month, year;
    date = '' + data.getDate();
    month = '' + (data.getMonth() + 1);
    year = data.getFullYear();
    if (date.length < 2) {
      date = '0' + date;
    }
    if (month.length < 2) {
      month = '0' + month;
    }
    return year + '-' + month + '-' + date;
  }

  getNavigation() {
    var dateHtml, navHtml, nextWeekHtml, previousWeekHtml;
    previousWeekHtml = '<div id="ats-prev-week-container" class="ats-nav">' + this.settings.prevHtml + '</div>';
    nextWeekHtml = '<div id="ats-prev-week-container" class="ats-nav">' + this.settings.nextHtml + '</div>';
    dateHtml = '<div id="ats-current-date-container">' + this.getYearName(this.settings.startDate.getFullYear()) + ' ' + this.getMonthName(this.settings.startDate.getMonth()) + '</div>';
    navHtml = previousWeekHtml + ' ' + dateHtml + ' ' + nextWeekHtml;
    return navHtml;
  }

  getCurrentDate() {
    var now, nowDate, nowDateTime;
    now = new Date();
    nowDateTime = now.toISOString();
    nowDate = nowDateTime.split('T')[0];
    return nowDate;
  }

  getCurrentTime(index) {
    var time;
    time = new Date(this.getCurrentDate() + 'T00:00:00');
    time.setMinutes(index * this.settings.slotSpan);
    return time;
  }

  getTimeSlot() {
    var i, l, ref, ref1, ret, tmp;
    tmp = '';
    for (i = l = ref = this.startNum, ref1 = this.endNum; (ref <= ref1 ? l < ref1 : l > ref1); i = ref <= ref1 ? ++l : --l) {
      tmp += '<div id="ats-time-slot-' + i + '" class="ats-time-slot"> <div class="ats-time-slot-number">' + ('0' + this.getCurrentTime(i).getHours()).slice(-2) + ':' + ('0' + this.getCurrentTime(i).getMinutes()).slice(-2) + '</div> </div>';
    }
    ret = tmp;
    return ret;
  }

  getDatesHeader() {
    var className, date, i, l, ret, tmp;
    tmp = '';
    for (i = l = 0; l < 7; i = ++l) {
      date = this.setDate(i);
      className = 'ats-date-heading';
      if (date.getDay() === 0) {
        className += ' ats__sunday';
      } else if (date.getDay() === 6) {
        className += ' ats__saturday';
      } else {
        className += ' ats__weekday';
      }
      tmp += '<div id="ats-date-heading-' + i + '" class="' + className + '"> <div class="ats-date-number">' + date.getDate() + '</div> <div class="ats-date-text">' + this.settings.weekdays[date.getDay()] + '</div> </div>';
    }
    ret = tmp;
    return ret;
  }

  getAvailableTimeSlots() {
    var availableDate, className, date, i, isAvalable, j, k, l, m, mark, n, ref, ref1, ref2, tmp, tmpTimes;
    tmp = '';
    for (i = l = 0; l < 7; i = ++l) {
      tmpTimes = '';
      mark = '';
      date = this.setDate(i);
      for (j = m = ref = this.startNum, ref1 = this.endNum; (ref <= ref1 ? m < ref1 : m > ref1); j = ref <= ref1 ? ++m : --m) {
        isAvalable = false;
        for (k = n = 0, ref2 = this.settings.availabileTimeSlots[i].length; (0 <= ref2 ? n < ref2 : n > ref2); k = 0 <= ref2 ? ++n : --n) {
          availableDate = new Date(this.getCurrentDate() + 'T' + this.settings.availabileTimeSlots[i][k]);
          if (availableDate.getTime() === this.getCurrentTime(j).getTime()) {
            isAvalable = true;
          }
        }
        if (!isAvalable) {
          mark = '×';
          className = 'ats-time-slot';
        } else {
          mark = '○';
          className = 'ats-time-slot ats-time-slot__available';
        }
        tmpTimes += '<div class="' + className + '" data-time="' + ('0' + this.getCurrentTime(j).getHours()).slice(-2) + ':' + ('0' + this.getCurrentTime(j).getMinutes()).slice(-2) + '" data-date="' + this.formatDate(this.setDate(i)) + '">' + mark + '</div>';
      }
      className = 'ats-time-slot-container';
      if (date.getDay() === 0) {
        className += ' ats__sunday';
      } else if (date.getDay() === 6) {
        className += ' ats__saturday';
      } else {
        className += ' ats__weekday';
      }
      tmp += '<div id="ats-time-slot-container-' + i + '" class="' + className + '">' + tmpTimes + '</div>';
    }
    return tmp;
  }

  setAvailableTimeSlots(arr) {
    this.settings.availabileTimeSlots = arr;
    return this.render();
  }

  clearAvailableTimeSlots() {
    return this.settings.availabileTimeSlots = [[], [], [], [], [], [], []];
  }

  clickPrevWeek() {
    return document.getElementById('ats-prev-week').addEventListener('click', (e) => {
      this.settings.startDate = this.setDate(-7);
      this.clearAvailableTimeSlots();
      this.render(this.target);
      if (typeof this.onClickNavigator === 'function') {
        return this.onClickNavigator();
      }
    });
  }

  clickNextWeek() {
    return document.getElementById('ats-next-week').addEventListener('click', (e) => {
      this.settings.startDate = this.setDate(7);
      this.clearAvailableTimeSlots();
      this.render(this.target);
      if (typeof this.onClickNavigator === 'function') {
        return this.onClickNavigator();
      }
    });
  }

  clickAvailableTimeSlot() {
    return Array.from(document.getElementsByClassName('ats-time-slot__available')).forEach((target) => {
      return target.addEventListener('click', (e) => {
        var date, idx, time, tmp;
        date = target.getAttribute('data-date');
        time = target.getAttribute('data-time');
        tmp = date + ' ' + time;
        if (target.classList.contains('selected')) {
          target.classList.remove('selected');
          idx = this.settings.selectedDates.indexOf(tmp);
          if (idx !== -1) {
            this.settings.selectedDates.splice(idx, 1);
          }
        } else {
          if (this.settings.isMultiple) {
            target.classList.add('selected');
            this.settings.selectedDates.push(tmp);
          } else {
            this.settings.selectedDates.pop();
            if (!this.settings.selectedDates.length) {
              Array.from(document.getElementsByClassName('ats-time-slot__available')).forEach(function(target) {
                return target.classList.remove('selected');
              });
              target.classList.add('selected');
              this.settings.selectedDates.push(tmp);
            }
          }
        }
        if (typeof this.onClick === 'function') {
          return this.onClick();
        }
      });
    });
  }

  render() {
    var ret;
    ret = '<div id="ats-container"> <div id="ats-nav-container">' + this.getNavigation() + '</div> <div id="ats-week-container"> <div id="ats-times-container">' + this.getTimeSlot() + '</div> <div id="ats-dates-container">' + this.getDatesHeader() + '</div> <div id="ats-available-time-container">' + this.getAvailableTimeSlots() + '</div> </div> </div>';
    this.target.innerHTML = ret;
    this.clickPrevWeek();
    this.clickNextWeek();
    return this.clickAvailableTimeSlot();
  }

};

//# sourceMappingURL=index.js.map
