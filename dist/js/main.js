/*
available-time-slots

Copyright (c) 2022 Yoshiaki Murakami(https://github.com/ysakmrkm)

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
*/
var AvailableTimeSlots;

AvailableTimeSlots = class AvailableTimeSlots {
  constructor(target, options) {
    var dom, slotBaseTime, slotMaxTime, slotMaxTimeArray, slotMinTime, slotMinTimeArray;
    this.clickPrevWeekHandler = this.clickPrevWeekHandler.bind(this);
    this.clickNextWeekHander = this.clickNextWeekHander.bind(this);
    this.resizeContainerHeightHandler = this.resizeContainerHeightHandler.bind(this);
    this.prevHtml = '<div id="ats-prev-week" class="ats-nav__item ats-nav__item__prev"><</div>';
    this.nextHtml = '<div id="ats-next-week" class="ats-nav__item ats-nav__item__next">></div>';
    this.defaults = {
      availabileTimeSlotResource: '',
      availabileTimeSlots: [[], [], [], [], [], [], []],
      isMultiple: false,
      navigation: true,
      prevElem: '',
      nextElem: '',
      selectedDates: [],
      startDate: new Date(),
      endDate: '',
      slotMinTime: '00:00',
      slotMaxTime: '24:00',
      slotSpan: 30,
      businessHours: [0, 23],
      locale: 'en',
      scrollable: false,
      resizable: false,
      calendar: false,
      view: 'availableTimeSlots',
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
      displayAvailableCount: false,
      displayDateCount: 7,
      onClickTimeSlot: function() {},
      onClickNavigator: function() {},
      initDatePicker: function() {},
      destroyDatePicker: function() {}
    };
    this.settings = Object.assign({}, this.defaults, options);
    this.defaultNav = true;
    this.target = target;
    if (this.settings.prevElem === '') {
      dom = document.createElement('div');
      dom.innerHTML = this.prevHtml;
      this.prevElem = dom.firstChild;
    } else if (typeof this.settings.prevElem === 'string') {
      this.prevElem = document.querySelector(this.settings.prevElem);
      this.defaultNav = false;
    }
    if (this.settings.nextElem === '') {
      dom = document.createElement('div');
      dom.innerHTML = this.nextHtml;
      this.nextElem = dom.firstChild;
    } else if (typeof this.settings.nextElem === 'string') {
      this.nextElem = document.querySelector(this.settings.nextElem);
      this.defaultNav = false;
    }
    this.settings.startDate.setHours(0, 0, 0);
    this.initialStartDate = this.settings.startDate;
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
        if (this.settings.businessHours.length >= 7) {
          this.businessHours[index] = [];
          return elem.forEach((elem2, index2) => {
            return this.businessHours[index][index2] = [[elem2[0], 0, 0, 0], [elem2[1], 0, 0, 0]];
          });
        } else {
          return this.businessHours[index] = [[elem[0], 0, 0, 0], [elem[1], 0, 0, 0]];
        }
      });
    }
    this.startNum = Math.floor((slotMinTime.getTime() - slotBaseTime.getTime()) / (1000 * 60)) / this.settings.slotSpan;
    this.endNum = Math.floor((slotMaxTime.getTime() - slotBaseTime.getTime()) / (1000 * 60)) / this.settings.slotSpan;
    this.localeData = locales.find((u) => {
      return u.code === this.settings.locale;
    });
    this.daysPerWeek = 7;
    this.timeSlotSourceType = '';
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
    year = data.getFullYear();
    month = ('0' + (data.getMonth() + 1)).slice(-2);
    date = ('0' + data.getDate()).slice(-2);
    return year + '-' + month + '-' + date;
  }

  getNavigation() {
    var dateHtml, dateHtmlText, navHtml, nextWeekHtml, previousWeekHtml;
    if (this.settings.navigation) {
      previousWeekHtml = '<div id="ats-prev-week-container" class="ats-nav">' + this.prevElem.outerHTML + '</div>';
      nextWeekHtml = '<div id="ats-next-week-container" class="ats-nav">' + this.nextElem.outerHTML + '</div>';
      if (!this.defaultNav) {
        previousWeekHtml = '';
        nextWeekHtml = '';
      }
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
      dateHtml += '<div id="ats-calendar-container" class="ats-current-date__calendar"> <label id="ats-calendar" class="ats-calendar"><img id="ats-calendar-icon" class="ats-calendar__icon" src="' + this.settings.iconFilePath + this.settings.iconCalendar.fileName + '" width="' + this.settings.iconCalendar.width + '" height="' + this.settings.iconCalendar.height + '" data-toggle /><input id="ats-calendar-input" class="ats-calendar__input" name="ats-selected-date" type="text" value="' + this.formatDate(this.settings.startDate) + '" data-input readonly></label> </div>';
    }
    dateHtml += '</div>';
    navHtml = previousWeekHtml + ' ' + dateHtml + ' ' + nextWeekHtml;
    return navHtml;
  }

  getCurrentDate() {
    var now, nowDate;
    now = new Date();
    nowDate = this.formatDate(now);
    return nowDate;
  }

  getCurrentTime(index) {
    var time;
    time = new Date(this.getCurrentDate() + 'T00:00:00');
    time.setMinutes(index * this.settings.slotSpan);
    return time;
  }

  getTimeLine() {
    var i, n, ref, ref1, ret, tmp;
    tmp = '';
    for (i = n = ref = this.startNum, ref1 = this.endNum; (ref <= ref1 ? n < ref1 : n > ref1); i = ref <= ref1 ? ++n : --n) {
      tmp += '<div id="ats-time-line-' + i + '" class="ats-time-line"> <div class="ats-time-line-number">' + ('0' + this.getCurrentTime(i).getHours()).slice(-2) + ':' + ('0' + this.getCurrentTime(i).getMinutes()).slice(-2) + '</div> </div>';
    }
    ret = tmp;
    return ret;
  }

  getDatesHeader() {
    var classList, date, i, n, ref, ret, tmp;
    tmp = '';
    for (i = n = 0, ref = this.settings.displayDateCount; (0 <= ref ? n < ref : n > ref); i = 0 <= ref ? ++n : --n) {
      date = this.setDate(i);
      classList = [];
      classList.push('ats-date-heading');
      if (date.getDay() === 0) {
        classList.push('ats__sunday');
      } else if (date.getDay() === 6) {
        classList.push('ats__saturday');
      } else {
        classList.push('ats__weekday');
      }
      tmp += '<div id="ats-date-heading-' + i + '" class="' + classList.join(' ') + '" data-date="' + this.formatDate(date) + '" data-date-index="' + i + '"> <div class="ats-date-number">' + date.getDate() + '</div> <div class="ats-date-text">' + this.getWeekdayName(date.getDay()) + '</div> </div>';
    }
    ret = tmp;
    return ret;
  }

  getAvailableTimeSlots() {
    var availableDate, businessHoursEnd, businessHoursStart, className, count, currentBusinessHours, date, endDate, i, isAvalable, isBusinessHours, isOutOfRange, isPast, j, k, l, m, mark, n, now, o, p, ref, ref1, ref2, ref3, slotDate, timeIndex, timeIndexText, timeText, tmp, tmpTimes;
    tmp = '';
    now = new Date();
    endDate = new Date(this.settings.endDate);
    endDate.setHours(24, 0, 0, 0);
    for (i = n = 0, ref = this.settings.displayDateCount; (0 <= ref ? n < ref : n > ref); i = 0 <= ref ? ++n : --n) {
      tmpTimes = '';
      mark = '';
      date = this.setDate(i);
      m = date.getDay();
      for (j = o = ref1 = this.startNum, ref2 = this.endNum; (ref1 <= ref2 ? o < ref2 : o > ref2); j = ref1 <= ref2 ? ++o : --o) {
        isAvalable = false;
        isPast = false;
        isOutOfRange = false;
        isBusinessHours = false;
        className = 'ats-time-slot';
        if (typeof this.settings.businessHours[0] === 'object') {
          l = 0;
        }
        for (k = p = 0, ref3 = this.settings.availabileTimeSlots[i]['data'].length; (0 <= ref3 ? p < ref3 : p > ref3); k = 0 <= ref3 ? ++p : --p) {
          availableDate = new Date(this.settings.availabileTimeSlots[i]['date'] + 'T' + this.settings.availabileTimeSlots[i]['data'][k]['time'] + ':00');
          slotDate = new Date(this.formatDate(date) + 'T' + ('0' + this.getCurrentTime(j).getHours()).slice(-2) + ':' + ('0' + this.getCurrentTime(j).getMinutes()).slice(-2) + ':00');
          if (availableDate.getTime() === slotDate.getTime()) {
            isAvalable = true;
            if (this.settings.displayAvailableCount === true) {
              if (this.settings.availabileTimeSlots[i]['data'][k]['count'] !== void 0) {
                count = this.settings.availabileTimeSlots[i]['data'][k]['count'];
              } else {
                count = 0;
              }
            }
          }
          if (slotDate.getTime() - now.getTime() < 0) {
            isAvalable = false;
            isPast = true;
          }
          if (endDate !== '') {
            if (slotDate.getTime() - endDate.getTime() > 0) {
              isAvalable = false;
              isOutOfRange = true;
            }
          }
          businessHoursStart = new Date(date);
          businessHoursEnd = new Date(date);
          if (typeof this.settings.businessHours[0] === 'number' || typeof this.settings.businessHours[0] === 'string') {
            businessHoursStart.setHours(this.businessHours[0][0], this.businessHours[0][1], this.businessHours[0][2], this.businessHours[0][3]);
            businessHoursEnd.setHours(this.businessHours[1][0], this.businessHours[1][1], this.businessHours[1][2], this.businessHours[1][3]);
          }
          if (typeof this.settings.businessHours[0] === 'object') {
            if (this.businessHours.length >= this.daysPerWeek) {
              currentBusinessHours = this.businessHours[m][l];
              if (currentBusinessHours !== void 0 && l < this.businessHours[m].length) {
                businessHoursStart.setHours(currentBusinessHours[0][0], currentBusinessHours[0][1], currentBusinessHours[0][2], currentBusinessHours[0][3]);
                businessHoursEnd.setHours(currentBusinessHours[1][0], currentBusinessHours[1][1], currentBusinessHours[1][2], currentBusinessHours[1][3]);
              }
            } else {
              currentBusinessHours = this.businessHours[l];
              if (l < this.businessHours.length) {
                businessHoursStart.setHours(currentBusinessHours[0][0], currentBusinessHours[0][1], currentBusinessHours[0][2], currentBusinessHours[0][3]);
                businessHoursEnd.setHours(currentBusinessHours[1][0], currentBusinessHours[1][1], currentBusinessHours[1][2], currentBusinessHours[1][3]);
              }
            }
          }
          if (slotDate.getTime() - businessHoursStart.getTime() >= 0) {
            isBusinessHours = true;
          } else {
            isBusinessHours = false;
          }
          if (slotDate.getTime() - businessHoursEnd.getTime() >= 0) {
            isBusinessHours = false;
          }
          if (typeof this.settings.businessHours[0] === 'object') {
            if (slotDate.getTime() >= businessHoursEnd.getTime()) {
              if (currentBusinessHours !== void 0) {
                if (this.businessHours.length >= this.daysPerWeek) {
                  if (l < this.businessHours[m].length) {
                    l++;
                  }
                } else {
                  if (l < this.businessHours.length) {
                    l++;
                  }
                }
              }
            }
          }
        }
        if (isPast) {
          className += ' ats-time-slot__past';
          isPast = false;
        }
        if (isOutOfRange) {
          className += ' ats-time-slot__out-of-range';
          isOutOfRange = false;
          isBusinessHours = false;
        }
        if (isBusinessHours) {
          className += ' ats-time-slot__business-hours';
        }
        if (!isAvalable) {
          mark = '<p class="ats-icon"><img class="ats-icon-image" src="' + this.settings.iconFilePath + this.settings.iconCross.fileName + '" width="' + this.settings.iconCross.width + '" height="' + this.settings.iconCross.height + '" /></p>';
        } else {
          mark = '<p class="ats-icon"><img class="ats-icon-image" src="' + this.settings.iconFilePath + this.settings.iconCircle.fileName + '" width="' + this.settings.iconCircle.width + '" height="' + this.settings.iconCircle.height + '" /></p>';
          if (this.settings.displayAvailableCount === true) {
            mark += '<p class="ats-count">(' + count + ')</p>';
          }
          if (isBusinessHours) {
            className += ' ats-time-slot__available';
          }
        }
        if (!isBusinessHours) {
          mark = '';
        }
        if (slotDate !== void 0) {
          timeText = ('0' + slotDate.getHours()).slice(-2) + ':' + ('0' + slotDate.getMinutes()).slice(-2);
          timeIndex = this.settings.availabileTimeSlots[i]['data'].findIndex(function(elem) {
            return elem.time === timeText;
          });
        }
        timeIndexText = ' data-date-index="' + i + '"';
        if (timeIndex > -1) {
          timeIndexText += ' data-time-index="' + timeIndex + '"';
        }
        tmpTimes += '<div class="' + className + '" data-time="' + timeText + '" data-date="' + this.formatDate(date) + '"' + timeIndexText + ' ontouchstart="">' + mark + '</div>';
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
    this.timeSlotSourceType = typeof data;
    if (this.timeSlotSourceType === 'string') {
      queryStrings = new URLSearchParams(data.split('?')[1]);
      sourceUrl = data.split('?')[0] + '?';
      if (data.split('?')[1] !== void 0) {
        queryStrings.forEach((val, key) => {
          if (key === 'start') {
            sourceUrl += key + '=' + this.formatDate(this.setDate(0));
          } else {
            sourceUrl += key + '=' + val;
          }
          return sourceUrl += '&';
        });
        sourceUrl = sourceUrl.slice(0, -1);
      } else {
        sourceUrl += 'start=' + this.formatDate(this.setDate(0));
      }
      data = sourceUrl;
      request = new XMLHttpRequest();
      request.open('GET', data, true);
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          data = JSON.parse(request.responseText);
          this.settings.availabileTimeSlots = data.data;
          this.render();
        } else {

        }
      };
      request.onerror = function() {};
      request.send();
    }
    if (this.timeSlotSourceType === 'object') {
      this.settings.availabileTimeSlots = data.data;
      this.render();
    }
  }

  clearAvailableTimeSlots() {
    return this.settings.availabileTimeSlots = [[], [], [], [], [], [], []];
  }

  getAvailableTimes() {
    var containerClassList, date, i, isPast, m, mark, n, now, ref, tmp, tmpTimes;
    tmp = '';
    now = new Date();
    for (i = n = 0, ref = this.settings.displayDateCount; (0 <= ref ? n < ref : n > ref); i = 0 <= ref ? ++n : --n) {
      tmpTimes = '';
      mark = '';
      date = this.setDate(i);
      isPast = false;
      m = date.getDay();
      containerClassList = ['ats-time-slot-container'];
      if (date.getDay() === 0) {
        containerClassList.push('ats__sunday');
      } else if (date.getDay() === 6) {
        containerClassList.push('ats__saturday');
      } else {
        containerClassList.push('ats__weekday');
      }
      tmp += '<div class="' + containerClassList.join(' ') + '">';
      this.settings.availabileTimeSlots[i]['data'].forEach((elem, index) => {
        var count, slotClassList;
        slotClassList = ['ats-time-slot'];
        if (new Date(this.formatDate(date) + 'T' + elem).getTime() - now.getTime() < 0) {
          slotClassList.push('ats-time-slot__past');
          isPast = true;
        } else {
          slotClassList.push('ats-time-slot__available');
          isPast = false;
        }
        if (isPast !== true) {
          tmp += '<div class="' + slotClassList.join(' ') + '" data-time="' + elem + '" data-date="' + this.formatDate(date) + '">';
          tmp += elem;
          if (this.settings.displayAvailableCount === true) {
            if (this.settings.availabileTimeSlots[i]['count'] !== void 0) {
              count = this.settings.availabileTimeSlots[i]['count'][index];
              tmp += '<p class="ats-count">(' + count + ')</p>';
            }
          }
          return tmp += '</div>';
        }
      });
      tmp += '</div>';
    }
    return tmp;
  }

  clickPrevWeekHandler() {
    var currentDateTime, direction, startDateTime;
    currentDateTime = new Date(this.getCurrentDate()).getTime();
    startDateTime = new Date(document.getElementById('ats-date-heading-0').getAttribute('data-date')).getTime();
    if (startDateTime - currentDateTime <= 0) {
      document.getElementById(this.prevElem.id).classList.add('is-disable');
      return false;
    }
    this.settings.startDate = this.setDate(this.settings.displayDateCount * -1);
    this.clearAvailableTimeSlots();
    if (this.timeSlotSourceType === 'string') {
      this.setAvailableTimeSlots(this.settings.availabileTimeSlotResource);
    }
    if (typeof this.settings.onClickNavigator === 'function') {
      return this.settings.onClickNavigator(direction = 'prev');
    }
  }

  clickPrevWeek() {
    var currentDateTime, startDateTime;
    currentDateTime = new Date(this.getCurrentDate()).getTime();
    startDateTime = new Date(document.getElementById('ats-date-heading-0').getAttribute('data-date')).getTime();
    if (startDateTime - currentDateTime <= 0) {
      document.getElementById(this.prevElem.id).classList.add('is-disable');
    }
    return document.getElementById(this.prevElem.id).addEventListener('click', this.clickPrevWeekHandler, false);
  }

  clickNextWeekHander() {
    var direction;
    this.settings.startDate = this.setDate(this.settings.displayDateCount);
    this.clearAvailableTimeSlots();
    if (this.timeSlotSourceType === 'string') {
      this.setAvailableTimeSlots(this.settings.availabileTimeSlotResource);
    }
    document.getElementById(this.prevElem.id).classList.remove('is-disable');
    if (typeof this.settings.onClickNavigator === 'function') {
      return this.settings.onClickNavigator(direction = 'next');
    }
  }

  clickNextWeek() {
    return document.getElementById(this.nextElem.id).addEventListener('click', this.clickNextWeekHander, false);
  }

  clickAvailableTimeSlot() {
    return Array.from(document.getElementsByClassName('ats-time-slot__available')).forEach((target) => {
      return target.addEventListener('click', (e) => {
        var date, dateIndex, idx, time, timeIndex, tmp;
        date = target.getAttribute('data-date');
        time = target.getAttribute('data-time');
        dateIndex = target.getAttribute('data-date-index');
        timeIndex = target.getAttribute('data-time-index');
        tmp = {};
        tmp['date'] = date;
        tmp['data'] = this.settings.availabileTimeSlots[dateIndex]['data'][timeIndex];
        if (target.classList.contains('is-selected')) {
          target.classList.remove('is-selected');
          idx = this.settings.selectedDates.findIndex(function(elem) {
            return elem.data.time === tmp.data.time;
          });
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

  resizeContainerHeightHandler() {
    setTimeout(() => {
      this.changeContainerHeight();
    }, 100);
  }

  resizeContainerHeight() {
    return window.addEventListener('resize', this.resizeContainerHeightHandler, false);
  }

  render() {
    var classList, pastScrollTop, ret;
    ret = '<div id="ats-container"> <div id="ats-nav-container">' + this.getNavigation() + '</div>';
    ret += '<div id="ats-week-container"';
    classList = [];
    if (this.settings.view === 'availableTimeSlots') {
      classList.push('ats-view__available-time-slots');
    }
    if (this.settings.view === 'onlyAvailableTimes') {
      classList.push('ats-view__only-available-times');
    }
    if (this.settings.scrollable) {
      classList.push('ats__scrollable');
    }
    ret += ' class="' + classList.join(' ') + '"';
    ret += '>';
    ret += '<div id="ats-week-header"> <div id="ats-dates-container">';
    ret += this.getDatesHeader() + '</div> </div> <div id="ats-week-body">';
    if (this.settings.view === 'availableTimeSlots') {
      ret += '<div id="ats-times-container" class="ats-time-line-container">' + this.getTimeLine() + '</div> <div id="ats-available-time-container">' + this.getAvailableTimeSlots() + '</div>';
    }
    if (this.settings.view === 'onlyAvailableTimes') {
      ret += '<div id="ats-available-time-container">' + this.getAvailableTimes() + '</div>';
    }
    ret += '</div> </div> </div>';
    this.target.innerHTML = ret;
    if (this.settings.holidays !== '') {
      this.updateHoliday();
    }
    this.updateTimeSlot();
    if (this.settings.navigation) {
      document.getElementById(this.prevElem.id).removeEventListener('click', this.clickPrevWeekHandler, false);
      document.getElementById(this.nextElem.id).addEventListener('click', this.clickNextWeekHander, false);
      this.clickPrevWeek();
      this.clickNextWeek();
    }
    this.clickAvailableTimeSlot();
    if (this.settings.scrollable) {
      this.changeContainerHeight();
    }
    if (this.settings.resizable) {
      window.removeEventListener('resize', this.resizeContainerHeightHandler, false);
      this.resizeContainerHeight();
    }
    if (this.settings.calendar) {
      this.settings.initDatePicker();
      if (this.settings.initDatePicker() !== void 0) {
        this.settings.destroyDatePicker();
      }
      this.clickCalendar();
    }
    pastScrollTop = localStorage.getItem('ats_scrollTop');
    if (pastScrollTop !== null) {
      document.getElementById('ats-week-body').scrollTop = pastScrollTop;
    }
    return document.getElementById('ats-week-body').addEventListener('scroll', function() {
      return localStorage.setItem('ats_scrollTop', this.scrollTop);
    });
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
