###
available-time-slots

Copyright (c) 2022 Yoshiaki Murakami(https://github.com/ysakmrkm)

This software is released under the MIT License.
http://opensource.org/licenses/mit-license.php
###

class AvailableTimeSlots
  constructor: (target, options)->
    @prevHtml = '<div id="ats-prev-week" class="ats-nav__item ats-nav__item__prev"><</div>'
    @nextHtml = '<div id="ats-next-week" class="ats-nav__item ats-nav__item__next">></div>'
    @defaults = {
      availabileTimeSlotResource: '',
      availabileTimeSlots: [[], [], [], [], [], [], []],
      isMultiple: false
      navigation: true
      prevElem: ''
      nextElem: ''
      selectedDates: []
      startDate: new Date()
      endDate: ''
      slotMinTime: '00:00'
      slotMaxTime: '24:00'
      slotSpan: 30
      businessHours: [0,  23]
      locale: 'en'
      scrollable: false
      resizable: false,
      calendar: false
      view: 'availableTimeSlots'
      iconFilePath: './image/'
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
      onClickTimeSlot: ()->
      onClickNavigator: ()->
      initDatePicker: ()->
      destroyDatePicker: ()->
    }
    @settings = Object.assign({}, @defaults, options)
    @defaultNav = true

    @target = target

    if @settings.prevElem is ''
      dom = document.createElement('div')
      dom.innerHTML = @prevHtml
      @prevElem = dom.firstChild
    else if typeof @settings.prevElem is 'string'
      @prevElem = document.querySelector(@settings.prevElem)
      @defaultNav = false

    if @settings.nextElem is ''
      dom = document.createElement('div')
      dom.innerHTML = @nextHtml
      @nextElem = dom.firstChild
    else if typeof @settings.nextElem is 'string'
      @nextElem = document.querySelector(@settings.nextElem)
      @defaultNav = false

    @settings.startDate.setHours(0, 0, 0)
    @initialStartDate = @settings.startDate

    slotBaseTime = new Date()
    slotBaseTime.setHours(0, 0, 0, 0)

    slotMinTime = new Date()
    slotMinTimeArray = @settings.slotMinTime.replace(/0+(?=[0-9])/g, '').split(':')
    slotMinTime.setHours(slotMinTimeArray[0], slotMinTimeArray[1], 0, 0)

    slotMaxTime = new Date()
    slotMaxTimeArray = @settings.slotMaxTime.replace(/0+(?=[0-9])/g, '').split(':')
    slotMaxTime.setHours(slotMaxTimeArray[0], slotMaxTimeArray[1], 0, 0)

    if typeof @settings.businessHours[0] is 'number' or 'string'
      @businessHours = [[@settings.businessHours[0], 0, 0, 0], [@settings.businessHours[1], 0, 0, 0]]

    if typeof @settings.businessHours[0] is 'object'
      @settings.businessHours.forEach((elem, index)=>
        if @settings.businessHours.length >= 7
          @businessHours[index] = []

          elem.forEach((elem2, index2)=>
            @businessHours[index][index2] = [[elem2[0], 0, 0, 0], [elem2[1], 0, 0, 0]]
          )
        else
          @businessHours[index] = [[elem[0], 0, 0, 0], [elem[1], 0, 0, 0]]
      )

    @startNum = Math.floor((slotMinTime.getTime() - slotBaseTime.getTime()) / (1000 * 60)) / @settings.slotSpan
    @endNum = Math.floor((slotMaxTime.getTime() - slotBaseTime.getTime()) / (1000 * 60)) / @settings.slotSpan
    @localeData = locales.find((u)=> u.code is @settings.locale)
    @daysPerWeek = 7
    @timeSlotSourceType = ''

  setDate: (days)->
    date = new Date(@settings.startDate.valueOf())
    date.setDate(date.getDate() + days)
    return date

  getYearName: (year)->
    switch @localeData.code
      when 'ja'
        return year + '年'
      else
        return year

  getMonthName: (index)->
    switch @localeData.code
      when 'ja'
        return @localeData.months[index]
      else
        return @localeData.months[index]

  getWeekdayName: (index)->
    switch @localeData.code
      when 'ja'
        return '（' + @localeData.weekdays[index] + '）'
      else
        return @localeData.weekdays[index]

  formatDate: (data)->
    year = data.getFullYear()
    month = ('0' + (data.getMonth() + 1)).slice(-2)
    date = ('0' + data.getDate()).slice(-2)

    return year + '-' + month + '-' + date

  getNavigation: ()->
    if @settings.navigation
      previousWeekHtml = '<div id="ats-prev-week-container" class="ats-nav">' + @prevElem.outerHTML + '</div>'
      nextWeekHtml = '<div id="ats-next-week-container" class="ats-nav">' + @nextElem.outerHTML + '</div>'

      if not @defaultNav
        previousWeekHtml = ''
        nextWeekHtml = ''
    else
      previousWeekHtml = ''
      nextWeekHtml = ''

    switch @localeData.code
      when 'ja'
        dateHtmlText = @getYearName(@settings.startDate.getFullYear()) + ' ' + @getMonthName(@settings.startDate.getMonth())
      else
        dateHtmlText = @getMonthName(@settings.startDate.getMonth()) + ', ' + @getYearName(@settings.startDate.getFullYear())

    dateHtml = '<div id="ats-current-date-container">
    <div class="ats-current-date__text">' + dateHtmlText + '</div>'

    if @settings.calendar
      dateHtml += '<div id="ats-calendar-container" class="ats-current-date__calendar">
      <label id="ats-calendar" class="ats-calendar"><img id="ats-calendar-icon" class="ats-calendar__icon" src="' + @settings.iconFilePath + @settings.iconCalendar.fileName + '" width="' + @settings.iconCalendar.width + '" height="' + @settings.iconCalendar.height + '" data-toggle /><input id="ats-calendar-input" class="ats-calendar__input" name="ats-selected-date" type="text" value="' + @formatDate(@settings.startDate) + '" data-input readonly></label>
      </div>'

    dateHtml += '</div>'

    navHtml = previousWeekHtml + ' ' + dateHtml + ' ' + nextWeekHtml

    return navHtml

  getCurrentDate: ()->
    now = new Date()
    nowDate = @formatDate(now)

    return nowDate

  getCurrentTime: (index)->
    time = new Date(@getCurrentDate() + 'T00:00:00')
    time.setMinutes(index * @settings.slotSpan)

    return time

  getTimeLine: ()->
    tmp = ''

    for i in [@startNum...@endNum]
      tmp += '<div id="ats-time-line-' + i + '" class="ats-time-line">
      <div class="ats-time-line-number">' + ('0' + @getCurrentTime(i).getHours()).slice(-2) + ':' + ('0' + @getCurrentTime(i).getMinutes()).slice(-2) + '</div>
      </div>'

    ret = tmp

    return ret

  getDatesHeader: ()->
    tmp = ''

    for i in [0...@settings.displayDateCount]
      date = @setDate(i)

      classList = []

      classList.push('ats-date-heading')

      if date.getDay() is 0
        classList.push('ats__sunday')
      else if date.getDay() is 6
        classList.push('ats__saturday')
      else
        classList.push('ats__weekday')

      tmp += '<div id="ats-date-heading-' + i + '" class="' + classList.join(' ') + '" data-date="' + @formatDate(date) + '" data-date-index="' + i + '">
        <div class="ats-date-number">' + date.getDate() + '</div>
        <div class="ats-date-text">' + @getWeekdayName(date.getDay()) + '</div>
      </div>'

    ret = tmp

    return ret

  getAvailableTimeSlots: ()->
    tmp = ''
    now = new Date()

    endDate = new Date(@settings.endDate)
    endDate.setHours(24, 0, 0, 0)

    for i in [0...@settings.displayDateCount]
      tmpTimes = ''
      mark = ''
      date = @setDate(i)

      m = date.getDay()

      for j in [@startNum...@endNum]
        isAvalable = false
        isPast = false
        isOutOfRange = false
        isBusinessHours = false

        className = 'ats-time-slot'

        if typeof @settings.businessHours[0] is 'object'
          l = 0

        for k in [0...@settings.availabileTimeSlots[i]['data'].length]
          availableDate = new Date(@settings.availabileTimeSlots[i]['date'] + 'T' + @settings.availabileTimeSlots[i]['data'][k]['time']+':00')
          slotDate = new Date(@formatDate(date) + 'T' + ('0' + @getCurrentTime(j).getHours()).slice(-2) + ':' + ('0' + @getCurrentTime(j).getMinutes()).slice(-2)+':00')

          if availableDate.getTime() is slotDate.getTime()
            isAvalable = true

            if @settings.displayAvailableCount is true
              if @settings.availabileTimeSlots[i]['data'][k]['count'] isnt undefined
                count = @settings.availabileTimeSlots[i]['data'][k]['count']
              else
                count = 0

          if slotDate.getTime() - now.getTime() < 0
            isAvalable = false
            isPast = true

          if endDate isnt ''
            if slotDate.getTime() - endDate.getTime() > 0
              isAvalable = false
              isOutOfRange = true

          businessHoursStart = new Date(date)
          businessHoursEnd = new Date(date)

          if typeof @settings.businessHours[0] is 'number' or typeof @settings.businessHours[0] is 'string'
            businessHoursStart.setHours(@businessHours[0][0], @businessHours[0][1], @businessHours[0][2], @businessHours[0][3])
            businessHoursEnd.setHours(@businessHours[1][0], @businessHours[1][1], @businessHours[1][2], @businessHours[1][3])

          if typeof @settings.businessHours[0] is 'object'
            if @businessHours.length >= @daysPerWeek
              currentBusinessHours = @businessHours[m][l]

              if currentBusinessHours isnt undefined and l < @businessHours[m].length
                businessHoursStart.setHours(currentBusinessHours[0][0], currentBusinessHours[0][1], currentBusinessHours[0][2], currentBusinessHours[0][3])
                businessHoursEnd.setHours(currentBusinessHours[1][0], currentBusinessHours[1][1], currentBusinessHours[1][2], currentBusinessHours[1][3])
            else
              currentBusinessHours = @businessHours[l]

              if l < @businessHours.length
                businessHoursStart.setHours(currentBusinessHours[0][0], currentBusinessHours[0][1], currentBusinessHours[0][2], currentBusinessHours[0][3])
                businessHoursEnd.setHours(currentBusinessHours[1][0], currentBusinessHours[1][1], currentBusinessHours[1][2], currentBusinessHours[1][3])

          if slotDate.getTime() - businessHoursStart.getTime() >= 0
            isBusinessHours = true
          else
            isBusinessHours = false

          if slotDate.getTime() - businessHoursEnd.getTime() >= 0
            isBusinessHours = false

          if typeof @settings.businessHours[0] is 'object'
            if slotDate.getTime() >= businessHoursEnd.getTime()
              if currentBusinessHours isnt undefined
                if @businessHours.length >= @daysPerWeek
                  if l < @businessHours[m].length
                    l++
                else
                  if l < @businessHours.length
                    l++

        if isPast
          className += ' ats-time-slot__past'
          isPast = false

        if isOutOfRange
          className += ' ats-time-slot__out-of-range'
          isOutOfRange = false
          isBusinessHours = false

        if isBusinessHours
          className += ' ats-time-slot__business-hours'

        if not isAvalable
          mark = '<p class="ats-icon"><img class="ats-icon-image" src="' + @settings.iconFilePath + @settings.iconCross.fileName + '" width="' + @settings.iconCross.width + '" height="' + @settings.iconCross.height + '" /></p>'
        else
          mark = '<p class="ats-icon"><img class="ats-icon-image" src="' + @settings.iconFilePath + @settings.iconCircle.fileName + '" width="' + @settings.iconCircle.width + '" height="' + @settings.iconCircle.height + '" /></p>'

          if @settings.displayAvailableCount is true
            mark += '<p class="ats-count">(' + count + ')</p>'

          if isBusinessHours
            className += ' ats-time-slot__available'

        if not isBusinessHours
          mark = ''

        if slotDate isnt undefined
          timeText = ('0' + slotDate.getHours()).slice(-2) + ':' + ('0' + slotDate.getMinutes()).slice(-2)

          timeIndex = @settings.availabileTimeSlots[i]['data'].findIndex((elem)-> elem.time is timeText)

        timeIndexText = ' data-date-index="' + i + '"'

        if timeIndex > -1
          timeIndexText += ' data-time-index="' + timeIndex + '"'

        tmpTimes += '<div class="' + className + '" data-time="' + timeText + '" data-date="' + @formatDate(date) + '"' + timeIndexText + ' ontouchstart="">' + mark + '</div>'

      className = 'ats-time-slot-container'

      if date.getDay() is 0
        className += ' ats__sunday'
      else if date.getDay() is 6
        className += ' ats__saturday'
      else
        className += ' ats__weekday'

      tmp += '<div id="ats-time-slot-container-' + i + '" class="' + className + '">' + tmpTimes + '</div>'

    return tmp

  setAvailableTimeSlots: (data)->
    @timeSlotSourceType = typeof data

    if @timeSlotSourceType is 'string'
      queryStrings = new URLSearchParams(data.split('?')[1])

      sourceUrl = data.split('?')[0] + '?'

      if data.split('?')[1] isnt undefined
        queryStrings.forEach((val, key)=>
          if key is 'start'
            sourceUrl += key + '=' + @formatDate(@setDate(0))
          else
            sourceUrl += key + '=' + val

          sourceUrl += '&'
        )

        sourceUrl = sourceUrl.slice(0, -1)
      else
        sourceUrl += 'start=' + @formatDate(@setDate(0))

      data = sourceUrl

      request = new XMLHttpRequest()
      request.open('GET', data, true)

      request.onload = ()=>
        if request.status >= 200 and request.status < 400
          data = JSON.parse(request.responseText)

          @settings.availabileTimeSlots = data.data

          @render()

          return
        else

      request.onerror = ()->

      request.send()

    if @timeSlotSourceType is 'object'
      @settings.availabileTimeSlots = data.data

      @render()

      return

  clearAvailableTimeSlots: ()->
    @settings.availabileTimeSlots = [[], [], [], [], [], [], []]

  getAvailableTimes: ()->
    tmp = ''
    now = new Date()

    for i in [0...@settings.displayDateCount]
      tmpTimes = ''
      mark = ''
      date = @setDate(i)
      isPast = false

      m = date.getDay()

      containerClassList = ['ats-time-slot-container']

      if date.getDay() is 0
        containerClassList.push('ats__sunday')
      else if date.getDay() is 6
        containerClassList.push('ats__saturday')
      else
        containerClassList.push('ats__weekday')

      tmp += '<div class="' + containerClassList.join(' ') + '">'

      @settings.availabileTimeSlots[i]['data'].forEach((elem, index)=>
        slotClassList = ['ats-time-slot']

        if new Date(@formatDate(date) + 'T' + elem).getTime() - now.getTime() < 0
          slotClassList.push('ats-time-slot__past')
          isPast = true
        else
          slotClassList.push('ats-time-slot__available')
          isPast = false

        if isPast isnt true
          tmp += '<div class="' + slotClassList.join(' ') + '" data-time="' + elem + '" data-date="' + @formatDate(date) + '">'
          tmp += elem

          if @settings.displayAvailableCount is true
            if @settings.availabileTimeSlots[i]['count'] isnt undefined
              count = @settings.availabileTimeSlots[i]['count'][index]

              tmp += '<p class="ats-count">(' + count + ')</p>'

          tmp += '</div>'
      )

      tmp += '</div>'

    return tmp

  clickPrevWeekHandler: ()=>
    currentDateTime = new Date(@getCurrentDate()).getTime()
    startDateTime = new Date(document.getElementById('ats-date-heading-0').getAttribute('data-date')).getTime()

    if startDateTime - currentDateTime <= 0
      document.getElementById(@prevElem.id).classList.add('is-disable')
      return false

    @settings.startDate = @setDate(@settings.displayDateCount * -1)
    @clearAvailableTimeSlots()

    if @timeSlotSourceType is 'string'
      @setAvailableTimeSlots(@settings.availabileTimeSlotResource)

    if typeof @settings.onClickNavigator is 'function'
      @settings.onClickNavigator(direction = 'prev')

  clickPrevWeek: ()->
    currentDateTime = new Date(@getCurrentDate()).getTime()
    startDateTime = new Date(document.getElementById('ats-date-heading-0').getAttribute('data-date')).getTime()

    if startDateTime - currentDateTime <= 0
      document.getElementById(@prevElem.id).classList.add('is-disable')

    document.getElementById(@prevElem.id).addEventListener('click', @clickPrevWeekHandler, false)

  clickNextWeekHander: ()=>
    @settings.startDate = @setDate(@settings.displayDateCount)
    @clearAvailableTimeSlots()

    if @timeSlotSourceType is 'string'
      @setAvailableTimeSlots(@settings.availabileTimeSlotResource)

    document.getElementById(@prevElem.id).classList.remove('is-disable')

    if typeof @settings.onClickNavigator is 'function'
      @settings.onClickNavigator(direction = 'next')

  clickNextWeek: ()->
    document.getElementById(@nextElem.id).addEventListener('click', @clickNextWeekHander, false)

  clickAvailableTimeSlot: ()->
    Array.from(document.getElementsByClassName('ats-time-slot__available')).forEach((target)=>
      target.addEventListener('click', (e)=>
        date = target.getAttribute('data-date')
        time = target.getAttribute('data-time')

        dateIndex = target.getAttribute('data-date-index')
        timeIndex = target.getAttribute('data-time-index')

        tmp = {}
        tmp['date'] = date
        tmp['data'] = @settings.availabileTimeSlots[dateIndex]['data'][timeIndex]

        if target.classList.contains('is-selected')
          target.classList.remove('is-selected')
          idx = @settings.selectedDates.findIndex((elem)-> elem.data.time is tmp.data.time)

          localStorage.removeItem('ats_selected_date')
          localStorage.removeItem('ats_selected_time')

          if idx isnt -1
            @settings.selectedDates.splice(idx, 1)
        else
          if @settings.isMultiple
            target.classList.add('is-selected')
            @settings.selectedDates.push(tmp)
          else
            @settings.selectedDates.pop()

            localStorage.setItem('ats_selected_date', date)
            localStorage.setItem('ats_selected_time', time)

            if not @settings.selectedDates.length
              Array.from(document.getElementsByClassName('ats-time-slot__available')).forEach((target)->
                target.classList.remove('is-selected')
              )

              target.classList.add('is-selected')
              @settings.selectedDates.push(tmp)

        if typeof @settings.onClickTimeSlot is 'function'
          @settings.onClickTimeSlot(@settings.selectedDates)
      )
    )

  updateTimeSlot: ()->
    selectedDate = localStorage.getItem('ats_selected_date')
    selectedTime = localStorage.getItem('ats_selected_time')

    if selectedDate isnt null and selectedTime isnt null
      Array.from(document.getElementsByClassName('ats-time-slot')).forEach((target)->
        if target.getAttribute('data-date') is selectedDate and target.getAttribute('data-time') is selectedTime
          if target.classList.contains('ats-time-slot__available')
            target.classList.add('is-selected')
          else
            localStorage.removeItem('ats_selected_date')
            localStorage.removeItem('ats_selected_time')
      )

  clickCalendar: ()->
    document.getElementById('ats-calendar').addEventListener('change', (e)=>
      @settings.startDate = new Date(e.target.value)
      @setAvailableTimeSlots(@settings.availabileTimeSlotResource)
    )

  changeContainerHeight: ()->
    if typeof @settings.scrollable is 'boolean'
      document.getElementById('ats-week-container').style.height = (
        window.innerHeight -
        document.getElementById('ats-week-container').getBoundingClientRect().top -
        document.getElementById('ats-week-container').getBoundingClientRect().x
      ) + 'px'
    if typeof @settings.scrollable is 'string'
      document.getElementById('ats-week-container').style.height = @settings.scrollable

  resizeContainerHeightHandler: ()=>
    setTimeout(()=>
      @changeContainerHeight()
      return
    , 100)
    return

  resizeContainerHeight: ()->
    window.addEventListener('resize', @resizeContainerHeightHandler, false)

  render: ()->
    ret = '<div id="ats-container">
      <div id="ats-nav-container">' + @getNavigation() + '</div>'
    ret += '<div id="ats-week-container"'

    classList = []

    if @settings.view is 'availableTimeSlots'
      classList.push('ats-view__available-time-slots')

    if @settings.view is 'onlyAvailableTimes'
      classList.push('ats-view__only-available-times')

    if @settings.scrollable
      classList.push('ats__scrollable')

    ret += ' class="' + classList.join(' ') + '"'

    ret += '>'
    ret += '<div id="ats-week-header">
    <div id="ats-dates-container">'
    ret += @getDatesHeader() + '</div>
    </div>
    <div id="ats-week-body">'

    if @settings.view is 'availableTimeSlots'
      ret += '<div id="ats-times-container" class="ats-time-line-container">' + @getTimeLine() + '</div>
      <div id="ats-available-time-container">' + @getAvailableTimeSlots() + '</div>'

    if @settings.view is 'onlyAvailableTimes'
      ret += '<div id="ats-available-time-container">' + @getAvailableTimes() + '</div>'

    ret += '</div>
    </div>
    </div>'

    @target.innerHTML = ret

    if @settings.holidays isnt ''
      @updateHoliday()

    @updateTimeSlot()

    if @settings.navigation
      document.getElementById(@prevElem.id).removeEventListener('click', @clickPrevWeekHandler, false)
      document.getElementById(@nextElem.id).addEventListener('click', @clickNextWeekHander, false)

      @clickPrevWeek()
      @clickNextWeek()

    @clickAvailableTimeSlot()

    if @settings.scrollable
      @changeContainerHeight()

    if @settings.resizable
      window.removeEventListener('resize', @resizeContainerHeightHandler, false)

      @resizeContainerHeight()

    if @settings.calendar
      @settings.initDatePicker()

      if @settings.initDatePicker() isnt undefined
        @settings.destroyDatePicker()

      @clickCalendar()

    pastScrollTop = localStorage.getItem('ats_scrollTop')

    if pastScrollTop isnt null
      document.getElementById('ats-week-body').scrollTop = pastScrollTop

    document.getElementById('ats-week-body').addEventListener('scroll', ()->
      localStorage.setItem('ats_scrollTop', this.scrollTop)
    )

  updateHoliday: ()->
    request = new XMLHttpRequest()
    request.open('GET', @settings.holidays, true)

    request.onload = ()->
      if request.status >= 200 and request.status < 400
        data = JSON.parse(request.responseText)

        Object.keys(data).forEach((key)->
          headings = document.getElementsByClassName('ats-date-heading')
          slots = document.getElementsByClassName('ats-time-slot-container')

          Array.from(headings).forEach((target, index)->
            current = target.getAttribute('data-date')

            if key is current
              headings[index].classList.add('ats__holiday')
              slots[index].classList.add('ats__holiday')
          )
        )
      else

    request.onerror = ()->

    request.send()

  init: ()->
    @setAvailableTimeSlots(@settings.availabileTimeSlotResource)