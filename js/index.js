var AvailableTimeSlots;

AvailableTimeSlots = class AvailableTimeSlots {
  constructor(target, options) {
    this.prevHtml = '<div id="ats-prev-week" class="ats-nav__item ats-nav__item__prev"><</div>';
    this.nextHtml = '<div id="ats-next-week" class="ats-nav__item ats-nav__item__next">></div>';
    this.defaults = {
      availabileTimeSlotResource: '',
      availabileTimeSlots: [[], [], [], [], [], [], []],
      isMultiple: false,
      prevHtml: this.prevHtml,
      nextHtml: this.nextHtml,
      selectedDates: [],
      startDate: new Date(),
      slotSpan: 30,
      businessHour: [0, 23],
      months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      weekdays: ['日', '月', '火', '水', '木', '金', '土'],
      holidays: 'https://holidays-jp.github.io/api/v1/date.json'
    };
    this.settings = Object.assign({}, this.defaults, options);
    this.startNum = (this.settings.businessHour[0] * 60) / this.settings.slotSpan;
    this.endNum = (this.settings.businessHour[1] * 60) / this.settings.slotSpan;
    this.onClickTimeSlot = this.settings.onClickTimeSlot;
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
    return this.settings.months[index] + '月';
  }

  getWeekdayName(index) {
    return '（' + this.settings.weekdays[index] + '）';
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

  getTimeLine() {
    var i, l, ref, ref1, ret, tmp;
    tmp = '';
    for (i = l = ref = this.startNum, ref1 = this.endNum; (ref <= ref1 ? l < ref1 : l > ref1); i = ref <= ref1 ? ++l : --l) {
      tmp += '<div id="ats-time-line-' + i + '" class="ats-time-line"> <div class="ats-time-line-number">' + ('0' + this.getCurrentTime(i).getHours()).slice(-2) + ':' + ('0' + this.getCurrentTime(i).getMinutes()).slice(-2) + '</div> </div>';
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
      tmp += '<div id="ats-date-heading-' + i + '" class="' + className + '" data-date="' + this.formatDate(date) + '"> <div class="ats-date-number">' + date.getDate() + '</div> <div class="ats-date-text">' + this.getWeekdayName(date.getDay()) + '</div> </div>';
    }
    ret = tmp;
    return ret;
  }

  getAvailableTimeSlots() {
    var availableDate, className, date, i, isAvalable, isPast, j, k, l, m, mark, n, now, ref, ref1, ref2, slotDate, tmp, tmpTimes;
    tmp = '';
    now = new Date();
    for (i = l = 0; l < 7; i = ++l) {
      tmpTimes = '';
      mark = '';
      date = this.setDate(i);
      for (j = m = ref = this.startNum, ref1 = this.endNum; (ref <= ref1 ? m < ref1 : m > ref1); j = ref <= ref1 ? ++m : --m) {
        isAvalable = false;
        isPast = false;
        className = 'ats-time-slot';
        for (k = n = 0, ref2 = this.settings.availabileTimeSlots[i].length; (0 <= ref2 ? n < ref2 : n > ref2); k = 0 <= ref2 ? ++n : --n) {
          availableDate = new Date(date.toISOString().split('T')[0] + 'T' + this.settings.availabileTimeSlots[i][k]);
          slotDate = new Date(date.toISOString().split('T')[0] + 'T' + ('0' + this.getCurrentTime(j).getHours()).slice(-2) + ':' + ('0' + this.getCurrentTime(j).getMinutes()).slice(-2));
          if (availableDate.getTime() === slotDate.getTime()) {
            isAvalable = true;
          }
          if (slotDate.getTime() - now.getTime() < 0) {
            isAvalable = false;
            isPast = true;
          }
        }
        if (isPast) {
          className += ' ats-time-slot__past';
          isPast = false;
        }
        if (!isAvalable) {
          mark = '<img src="./image/cross.svg" />';
        } else {
          mark = '<img src="./image/circle.svg" />';
          className += ' ats-time-slot__available';
        }
        tmpTimes += '<div class="' + className + '" data-time="' + ('0' + this.getCurrentTime(j).getHours()).slice(-2) + ':' + ('0' + this.getCurrentTime(j).getMinutes()).slice(-2) + '" data-date="' + this.formatDate(date) + '">' + mark + '</div>';
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

  setAvailableTimeSlots(data) {
    var request;
    if (typeof data === 'string') {
      request = new XMLHttpRequest();
      request.open('GET', data, true);
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          data = JSON.parse(request.responseText);
          data.data = data.data.sort(function() {
            return Math.random() - 0.5;
          });
          this.settings.availabileTimeSlots = data.data;
          return this.render();
        } else {

        }
      };
      request.onerror = function() {};
      request.send();
    }
    if (typeof data === 'object') {
      this.settings.availabileTimeSlots = data;
      return this.render();
    }
  }

  clearAvailableTimeSlots() {
    return this.settings.availabileTimeSlots = [[], [], [], [], [], [], []];
  }

  clickPrevWeek() {
    var currentDateTime, startDateTime;
    currentDateTime = new Date(this.getCurrentDate()).getTime();
    startDateTime = new Date(document.getElementById('ats-date-heading-0').getAttribute('data-date')).getTime();
    if (startDateTime - currentDateTime < 0) {
      document.getElementById('ats-prev-week').classList.add('is-disable');
    }
    return document.getElementById('ats-prev-week').addEventListener('click', (e) => {
      this.settings.startDate = this.setDate(-7);
      this.clearAvailableTimeSlots();
      this.setAvailableTimeSlots(this.settings.availabileTimeSlotResource);
      if (typeof this.onClickNavigator === 'function') {
        return this.onClickNavigator();
      }
    });
  }

  clickNextWeek() {
    return document.getElementById('ats-next-week').addEventListener('click', (e) => {
      this.settings.startDate = this.setDate(7);
      this.clearAvailableTimeSlots();
      this.setAvailableTimeSlots(this.settings.availabileTimeSlotResource);
      document.getElementById('ats-prev-week').classList.remove('is-disable');
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
        if (target.classList.contains('is-selected')) {
          target.classList.remove('is-selected');
          idx = this.settings.selectedDates.indexOf(tmp);
          if (idx !== -1) {
            this.settings.selectedDates.splice(idx, 1);
          }
        } else {
          if (this.settings.isMultiple) {
            target.classList.add('is-selected');
            this.settings.selectedDates.push(tmp);
          } else {
            this.settings.selectedDates.pop();
            if (!this.settings.selectedDates.length) {
              Array.from(document.getElementsByClassName('ats-time-slot__available')).forEach(function(target) {
                return target.classList.remove('is-selected');
              });
              target.classList.add('is-selected');
              this.settings.selectedDates.push(tmp);
            }
          }
        }
        if (typeof this.onClickTimeSlot === 'function') {
          return this.onClickTimeSlot(this.settings.selectedDates);
        }
      });
    });
  }

  render() {
    var ret;
    ret = '<div id="ats-container"> <div id="ats-nav-container">' + this.getNavigation() + '</div> <div id="ats-week-container"> <div id="ats-times-container">' + this.getTimeLine() + '</div> <div id="ats-dates-container">' + this.getDatesHeader() + '</div> <div id="ats-available-time-container">' + this.getAvailableTimeSlots() + '</div> </div> </div>';
    this.target.innerHTML = ret;
    if (this.settings.holidays !== '') {
      this.updateHoliday();
    }
    this.clickPrevWeek();
    this.clickNextWeek();
    return this.clickAvailableTimeSlot();
  }

  updateHoliday() {
    var request;
    request = new XMLHttpRequest();
    request.open('GET', this.settings.holidays, true);
    request.onload = function() {
      var data;
      if (request.status >= 200 && request.status < 400) {
        data = JSON.parse(request.responseText);
        return Object.keys(data).forEach(function(key) {
          var headings, slots;
          headings = document.getElementsByClassName('ats-date-heading');
          slots = document.getElementsByClassName('ats-time-slot-container');
          return Array.from(headings).forEach(function(target, index) {
            var current;
            current = target.getAttribute('data-date');
            if (key === current) {
              headings[index].classList.add('ats__holiday');
              return slots[index].classList.add('ats__holiday');
            }
          });
        });
      } else {

      }
    };
    request.onerror = function() {};
    return request.send();
  }

  init() {
    return this.setAvailableTimeSlots(this.settings.availabileTimeSlotResource);
  }

};

//# sourceMappingURL=index.js.map
