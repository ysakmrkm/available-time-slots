/*
available-time-slots

Copyright (c) 2022 Yoshiaki Murakami(https://github.com/ysakmrkm)

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/
var AvailableTimeSlots;

AvailableTimeSlots = class AvailableTimeSlots {
  constructor(target, options) {
    var slotBaseTime, slotMaxTime, slotMaxTimeArray, slotMinTime, slotMinTimeArray;
    this.prevHtml = '<div id="ats-prev-week" class="ats-nav__item ats-nav__item__prev"><</div>';
    this.nextHtml = '<div id="ats-next-week" class="ats-nav__item ats-nav__item__next">></div>';
    this.defaults = {
      availabileTimeSlotResource: '',
      availabileTimeSlots: [[], [], [], [], [], [], []],
      isMultiple: false,
      navigation: true,
      prevHtml: this.prevHtml,
      nextHtml: this.nextHtml,
      selectedDates: [],
      startDate: new Date(),
      slotMinTime: '00:00',
      slotMaxTime: '24:00',
      slotSpan: 30,
      businessHours: [0, 23],
      locale: 'en',
      scrollable: false,
      calendar: false,
      iconFilePath: './image/',
      iconCalendar: {
        fileName: 'calendar.svg',
        width: 40,
        height: 40
      },
      iconCross: {
        fileName: 'cross.svg',
        width: 20,
        height: 20
      },
      iconCircle: {
        fileName: 'circle.svg',
        width: 20,
        height: 20
      },
      onClickTimeSlot: function() {},
      onClickNavigator: function() {}
    };
    this.settings = Object.assign({}, this.defaults, options);
    slotBaseTime = new Date();
    slotBaseTime.setHours(0, 0, 0, 0);
    slotMinTime = new Date();
    slotMinTimeArray = this.settings.slotMinTime.replace(/0+(?=[0-9])/g, '').split(':');
    slotMinTime.setHours(slotMinTimeArray[0], slotMinTimeArray[1], 0, 0);
    slotMaxTime = new Date();
    slotMaxTimeArray = this.settings.slotMaxTime.replace(/0+(?=[0-9])/g, '').split(':');
    slotMaxTime.setHours(slotMaxTimeArray[0], slotMaxTimeArray[1], 0, 0);
    if (typeof this.settings.businessHours[0] === 'number' || 'string') {
      this.businessHours = [[this.settings.businessHours[0], 0, 0, 0], [this.settings.businessHours[1], 0, 0, 0]];
    }
    if (typeof this.settings.businessHours[0] === 'object') {
      this.settings.businessHours.forEach((elem, index) => {
        return this.businessHours[index] = [[elem[0], 0, 0, 0], [elem[1], 0, 0, 0]];
      });
    }
    this.startNum = Math.floor((slotMinTime.getTime() - slotBaseTime.getTime()) / (1000 * 60)) / this.settings.slotSpan;
    this.endNum = Math.floor((slotMaxTime.getTime() - slotBaseTime.getTime()) / (1000 * 60)) / this.settings.slotSpan;
    this.target = target;
    this.localeData = locales.find((u) => {
      return u.code === this.settings.locale;
    });
    this.initialStartDate = this.settings.startDate;
  }

  setDate(days) {
    var date;
    date = new Date(this.settings.startDate.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  getYearName(year) {
    switch (this.localeData.code) {
      case 'ja':
        return year + '年';
      default:
        return year;
    }
  }

  getMonthName(index) {
    switch (this.localeData.code) {
      case 'ja':
        return this.localeData.months[index];
      default:
        return this.localeData.months[index];
    }
  }

  getWeekdayName(index) {
    switch (this.localeData.code) {
      case 'ja':
        return '（' + this.localeData.weekdays[index] + '）';
      default:
        return this.localeData.weekdays[index];
    }
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
    var dateHtml, dateHtmlText, navHtml, nextWeekHtml, previousWeekHtml;
    if (this.settings.navigation) {
      previousWeekHtml = '<div id="ats-prev-week-container" class="ats-nav">' + this.settings.prevHtml + '</div>';
      nextWeekHtml = '<div id="ats-prev-week-container" class="ats-nav">' + this.settings.nextHtml + '</div>';
    } else {
      previousWeekHtml = '';
      nextWeekHtml = '';
    }
    switch (this.localeData.code) {
      case 'ja':
        dateHtmlText = this.getYearName(this.settings.startDate.getFullYear()) + ' ' + this.getMonthName(this.settings.startDate.getMonth());
        break;
      default:
        dateHtmlText = this.getMonthName(this.settings.startDate.getMonth()) + ', ' + this.getYearName(this.settings.startDate.getFullYear());
    }
    dateHtml = '<div id="ats-current-date-container"> <div class="ats-current-date__text">' + dateHtmlText + '</div>';
    if (this.settings.calendar) {
      dateHtml += '<div id="ats-calendar-container" class="ats-current-date__calendar"> <label id="ats-calendar" class="ats-calendar"><img id="ats-calendar-icon" class="ats-calendar__icon" src="' + this.settings.iconFilePath + this.settings.iconCalendar.fileName + '" width="' + this.settings.iconCalendar.width + '" height="' + this.settings.iconCalendar.height + '" data-toggle /><input id="ats-calendar-input" class="ats-calendar__input" name="ats-selected-date" type="text" value="' + this.formatDate(this.settings.startDate) + '" data-input></label> </div>';
    }
    dateHtml += '</div>';
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
    var i, m, ref, ref1, ret, tmp;
    tmp = '';
    for (i = m = ref = this.startNum, ref1 = this.endNum; (ref <= ref1 ? m < ref1 : m > ref1); i = ref <= ref1 ? ++m : --m) {
      tmp += '<div id="ats-time-line-' + i + '" class="ats-time-line"> <div class="ats-time-line-number">' + ('0' + this.getCurrentTime(i).getHours()).slice(-2) + ':' + ('0' + this.getCurrentTime(i).getMinutes()).slice(-2) + '</div> </div>';
    }
    ret = tmp;
    return ret;
  }

  getDatesHeader() {
    var className, date, i, m, ret, tmp;
    tmp = '';
    for (i = m = 0; m < 7; i = ++m) {
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
    var availableDate, businessHoursDate, businessHoursEnd, businessHoursMonth, businessHoursStart, className, date, i, isAvalable, isBusinessHours, isPast, j, k, l, m, mark, n, now, o, ref, ref1, ref2, slotDate, tmp, tmpTimes;
    tmp = '';
    now = new Date();
    for (i = m = 0; m < 7; i = ++m) {
      tmpTimes = '';
      mark = '';
      date = this.setDate(i);
      for (j = n = ref = this.startNum, ref1 = this.endNum; (ref <= ref1 ? n < ref1 : n > ref1); j = ref <= ref1 ? ++n : --n) {
        isAvalable = false;
        isPast = false;
        isBusinessHours = false;
        className = 'ats-time-slot';
        if (typeof this.settings.businessHours[0] === 'object') {
          l = 0;
        }
        for (k = o = 0, ref2 = this.settings.availabileTimeSlots[i]['data'].length; (0 <= ref2 ? o < ref2 : o > ref2); k = 0 <= ref2 ? ++o : --o) {
          availableDate = new Date(this.settings.availabileTimeSlots[i]['date'] + 'T' + this.settings.availabileTimeSlots[i]['data'][k] + ':00');
          slotDate = new Date(date.toISOString().split('T')[0] + 'T' + ('0' + this.getCurrentTime(j).getHours()).slice(-2) + ':' + ('0' + this.getCurrentTime(j).getMinutes()).slice(-2) + ':00');
          if (availableDate.getTime() === slotDate.getTime()) {
            isAvalable = true;
          }
          if (slotDate.getTime() - now.getTime() < 0) {
            isAvalable = false;
            isPast = true;
          }
          businessHoursStart = new Date();
          businessHoursEnd = new Date();
          if (typeof this.settings.businessHours[0] === 'number' || typeof this.settings.businessHours[0] === 'string') {
            businessHoursStart.setHours(this.businessHours[0][0], this.businessHours[0][1], this.businessHours[0][2], this.businessHours[0][3]);
            businessHoursEnd.setHours(this.businessHours[1][0], this.businessHours[1][1], this.businessHours[1][2], this.businessHours[1][3]);
          }
          if (typeof this.settings.businessHours[0] === 'object') {
            if (l < this.businessHours.length) {
              businessHoursStart.setHours(this.businessHours[l][0][0], this.businessHours[l][0][1], this.businessHours[l][0][2], this.businessHours[l][0][3]);
              businessHoursEnd.setHours(this.businessHours[l][1][0], this.businessHours[l][1][1], this.businessHours[l][1][2], this.businessHours[l][1][3]);
            }
          }
          businessHoursMonth = date.toISOString().split('T')[0].split('-')[1] - 1;
          businessHoursDate = date.toISOString().split('T')[0].split('-')[2];
          businessHoursStart.setMonth(businessHoursMonth);
          businessHoursStart.setDate(businessHoursDate);
          businessHoursEnd.setMonth(businessHoursMonth);
          businessHoursEnd.setDate(businessHoursDate);
          if (slotDate.getTime() - businessHoursStart.getTime() >= 0) {
            isBusinessHours = true;
          } else {
            isBusinessHours = false;
          }
          if (slotDate.getTime() - businessHoursEnd.getTime() >= 0) {
            isBusinessHours = false;
          }
          if (typeof this.settings.businessHours[0] === 'object') {
            if (slotDate.getTime() > businessHoursEnd.getTime()) {
              l++;
            }
          }
        }
        if (isBusinessHours) {
          className += ' ats-time-slot__business-hours';
        }
        if (isPast) {
          className += ' ats-time-slot__past';
          isPast = false;
        }
        if (!isAvalable) {
          mark = '<img src="' + this.settings.iconFilePath + this.settings.iconCross.fileName + '" width="' + this.settings.iconCross.width + '" height="' + this.settings.iconCross.height + '" />';
        } else {
          mark = '<img src="' + this.settings.iconFilePath + this.settings.iconCircle.fileName + '" width="' + this.settings.iconCircle.width + '" height="' + this.settings.iconCircle.height + '" />';
          className += ' ats-time-slot__available';
        }
        if (!isBusinessHours) {
          mark = '';
        }
        tmpTimes += '<div class="' + className + '" data-time="' + ('0' + slotDate.getHours()).slice(-2) + ':' + ('0' + slotDate.getMinutes()).slice(-2) + '" data-date="' + this.formatDate(date) + '">' + mark + '</div>';
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
    var queryStrings, request, sourceUrl;
    if (typeof data === 'string') {
      queryStrings = new URLSearchParams(data.split('?')[1]);
      sourceUrl = data.split('?')[0] + '?';
      if (data.split('?')[1] !== void 0) {
        queryStrings.forEach((val, key) => {
          if (key === 'start') {
            sourceUrl += key + '=' + this.setDate(0).toISOString().split('T')[0];
          } else {
            sourceUrl += key + '=' + val;
          }
          return sourceUrl += '&';
        });
        sourceUrl = sourceUrl.slice(0, -1);
      } else {
        sourceUrl += 'start=' + this.setDate(0).toISOString().split('T')[0];
      }
      data = sourceUrl;
      request = new XMLHttpRequest();
      request.open('GET', data, true);
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          data = JSON.parse(request.responseText);
          this.settings.availabileTimeSlots = data.data;
          return this.render();
        } else {

        }
      };
      request.onerror = function() {};
      request.send();
    }
    if (typeof data === 'object') {
      this.settings.availabileTimeSlots = data.data;
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
      var direction;
      this.settings.startDate = this.setDate(-7);
      this.clearAvailableTimeSlots();
      this.setAvailableTimeSlots(this.settings.availabileTimeSlotResource);
      if (typeof this.settings.onClickNavigator === 'function') {
        return this.settings.onClickNavigator(direction = 'prev');
      }
    });
  }

  clickNextWeek() {
    return document.getElementById('ats-next-week').addEventListener('click', (e) => {
      var direction;
      this.settings.startDate = this.setDate(7);
      this.clearAvailableTimeSlots();
      this.setAvailableTimeSlots(this.settings.availabileTimeSlotResource);
      document.getElementById('ats-prev-week').classList.remove('is-disable');
      if (typeof this.settings.onClickNavigator === 'function') {
        return this.settings.onClickNavigator(direction = 'next');
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
          localStorage.removeItem('ats_selected_date');
          localStorage.removeItem('ats_selected_time');
          if (idx !== -1) {
            this.settings.selectedDates.splice(idx, 1);
          }
        } else {
          if (this.settings.isMultiple) {
            target.classList.add('is-selected');
            this.settings.selectedDates.push(tmp);
          } else {
            this.settings.selectedDates.pop();
            localStorage.setItem('ats_selected_date', date);
            localStorage.setItem('ats_selected_time', time);
            if (!this.settings.selectedDates.length) {
              Array.from(document.getElementsByClassName('ats-time-slot__available')).forEach(function(target) {
                return target.classList.remove('is-selected');
              });
              target.classList.add('is-selected');
              this.settings.selectedDates.push(tmp);
            }
          }
        }
        if (typeof this.settings.onClickTimeSlot === 'function') {
          return this.settings.onClickTimeSlot(this.settings.selectedDates);
        }
      });
    });
  }

  updateTimeSlot() {
    var selectedDate, selectedTime;
    selectedDate = localStorage.getItem('ats_selected_date');
    selectedTime = localStorage.getItem('ats_selected_time');
    if (selectedDate !== null && selectedTime !== null) {
      return Array.from(document.getElementsByClassName('ats-time-slot')).forEach(function(target) {
        if (target.getAttribute('data-date') === selectedDate && target.getAttribute('data-time') === selectedTime) {
          if (target.classList.contains('ats-time-slot__available')) {
            return target.classList.add('is-selected');
          } else {
            localStorage.removeItem('ats_selected_date');
            return localStorage.removeItem('ats_selected_time');
          }
        }
      });
    }
  }

  clickCalendar() {
    flatpickr('#ats-calendar', {
      wrap: true,
      minDate: this.formatDate(this.initialStartDate)
    });
    return document.getElementById('ats-calendar').addEventListener('change', (e) => {
      this.settings.startDate = new Date(e.target.value);
      return this.setAvailableTimeSlots(this.settings.availabileTimeSlotResource);
    });
  }

  changeContainerHeight() {
    if (typeof this.settings.scrollable === 'boolean') {
      document.getElementById('ats-week-container').style.height = (window.innerHeight - document.getElementById('ats-week-container').getBoundingClientRect().top - document.getElementById('ats-week-container').getBoundingClientRect().x) + 'px';
    }
    if (typeof this.settings.scrollable === 'string') {
      return document.getElementById('ats-week-container').style.height = this.settings.scrollable;
    }
  }

  render() {
    var ret;
    ret = '<div id="ats-container"> <div id="ats-nav-container">' + this.getNavigation() + '</div>';
    ret += '<div id="ats-week-container"';
    if (this.settings.scrollable) {
      ret += ' class="ats__scrollable"';
    }
    ret += '>';
    ret += '<div id="ats-week-header"> <div id="ats-dates-container">' + this.getDatesHeader() + '</div> </div> <div id="ats-week-body"> <div id="ats-times-container">' + this.getTimeLine() + '</div> <div id="ats-available-time-container">' + this.getAvailableTimeSlots() + '</div> </div> </div> </div>';
    this.target.innerHTML = ret;
    if (this.settings.holidays !== '') {
      this.updateHoliday();
    }
    this.updateTimeSlot();
    if (this.settings.navigation) {
      this.clickPrevWeek();
      this.clickNextWeek();
    }
    this.clickAvailableTimeSlot();
    if (this.settings.scrollable) {
      this.changeContainerHeight();
    }
    if (this.settings.calendar) {
      return this.clickCalendar();
    }
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

//# sourceMappingURL=main.js.map
