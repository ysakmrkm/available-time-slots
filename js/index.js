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

  getTimeSlot() {
    var end, i, k, now, nowDate, nowDateTime, ref, ref1, ret, start, time, tmp;
    tmp = '';
    start = (this.settings.businessHour[0] * 60) / this.settings.slotSpan;
    end = (this.settings.businessHour[1] * 60) / this.settings.slotSpan;
    for (i = k = ref = start, ref1 = end; (ref <= ref1 ? k < ref1 : k > ref1); i = ref <= ref1 ? ++k : --k) {
      now = new Date();
      nowDateTime = now.toISOString();
      nowDate = nowDateTime.split('T')[0];
      time = new Date(nowDate + 'T00:00:00');
      time.setMinutes(i * this.settings.slotSpan);
      tmp += '<div id="ats-time-slot-' + i + '" class="ats-time-slot"> <div class="ats-time-slot-number">' + ('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2) + '</div> </div>';
    }
    ret = tmp;
    return ret;
  }

  getDatesHeader() {
    var d, i, k, ret, tmp;
    tmp = '';
    for (i = k = 0; k < 7; i = ++k) {
      d = this.setDate(i);
      tmp += '<div id="ats-date-heading-' + i + '" class="ats-date-heading"> <div class="ats-date-number">' + d.getDate() + '</div> <div class="ats-date-text">' + this.settings.weekdays[d.getDay()] + '</div> </div>';
    }
    ret = tmp;
    return ret;
  }

  getAvailableTimeSlots() {
    var i, j, k, l, ref, tmp, tmpAvailTimes;
    tmp = '';
    for (i = k = 0; k < 7; i = ++k) {
      tmpAvailTimes = '';
      for (j = l = 0, ref = this.settings.availabileTimeSlots[i].length; (0 <= ref ? l < ref : l > ref); j = 0 <= ref ? ++l : --l) {
        tmpAvailTimes += '<a class="ats-available-time-slot" data-time="' + this.settings.availabileTimeSlots[i][j] + '" data-date="' + this.formatDate(this.setDate(i)) + '">' + this.settings.availabileTimeSlots[i][j] + '</a>';
      }
      tmp += '<div class="ats-time-slot-container" id="ats-time-slot-container-' + i + '">' + tmpAvailTimes + '</div>';
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
    return Array.from(document.getElementsByClassName('ats-available-time-slot')).forEach((target) => {
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
              Array.from(document.getElementsByClassName('ats-available-time-slot')).forEach(function(target) {
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
