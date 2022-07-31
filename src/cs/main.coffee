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
      prevHtml: @prevHtml
      nextHtml: @nextHtml
      selectedDates: []
      startDate: new Date()
      slotMinTime: '00:00'
      slotMaxTime: '24:00'
      slotSpan: 30
      businessHours: [0,  23]
      locale: 'en'
      scrollable: false
      calendar: false
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
      onClickTimeSlot: ()->
      onClickNavigator: ()->
    }
    @settings = Object.assign({}, @defaults, options)

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
        if @settings.businessHours.length is 7
          @businessHours[index] = []

          elem.forEach((elem2, index2)=>
            @businessHours[index][index2] = [[elem2[0], 0, 0, 0], [elem2[1], 0, 0, 0]]
          )
        else
          @businessHours[index] = [[elem[0], 0, 0, 0], [elem[1], 0, 0, 0]]
      )

    @startNum = Math.floor((slotMinTime.getTime() - slotBaseTime.getTime()) / (1000 * 60)) / @settings.slotSpan
    @endNum = Math.floor((slotMaxTime.getTime() - slotBaseTime.getTime()) / (1000 * 60)) / @settings.slotSpan
    @target = target
    @localeData = locales.find((u)=> u.code is @settings.locale)
    @initialStartDate = @settings.startDate

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
      previousWeekHtml = '<div id="ats-prev-week-container" class="ats-nav">' + @settings.prevHtml + '</div>'
      nextWeekHtml = '<div id="ats-prev-week-container" class="ats-nav">' + @settings.nextHtml + '</div>'
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
      <label id="ats-calendar" class="ats-calendar"><img id="ats-calendar-icon" class="ats-calendar__icon" src="' + @settings.iconFilePath + @settings.iconCalendar.fileName + '" width="' + @settings.iconCalendar.width + '" height="' + @settings.iconCalendar.height + '" data-toggle /><input id="ats-calendar-input" class="ats-calendar__input" name="ats-selected-date" type="text" value="' + @formatDate(@settings.startDate) + '" data-input></label>
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

    for i in [0...7]
      date = @setDate(i)

      className = 'ats-date-heading'

      if date.getDay() is 0
        className += ' ats__sunday'
      else if date.getDay() is 6
        className += ' ats__saturday'
      else
        className += ' ats__weekday'

      tmp += '<div id="ats-date-heading-' + i + '" class="' + className + '" data-date="' + @formatDate(date) + '">
        <div class="ats-date-number">' + date.getDate() + '</div>
        <div class="ats-date-text">' + @getWeekdayName(date.getDay()) + '</div>
      </div>'

    ret = tmp

    return ret

  getAvailableTimeSlots: ()->
    tmp = ''
    now = new Date()

    for i in [0...7]
      tmpTimes = ''
      mark = ''
      date = @setDate(i)

      for j in [@startNum...@endNum]
        isAvalable = false
        isPast = false
        isBusinessHours = false

        className = 'ats-time-slot'

        if typeof @settings.businessHours[0] is 'object'
          l = 0

        for k in [0...@settings.availabileTimeSlots[i]['data'].length]
          availableDate = new Date(@settings.availabileTimeSlots[i]['date'] + 'T' + @settings.availabileTimeSlots[i]['data'][k]+':00')
          slotDate = new Date(@formatDate(date) + 'T' + ('0' + @getCurrentTime(j).getHours()).slice(-2) + ':' + ('0' + @getCurrentTime(j).getMinutes()).slice(-2)+':00')

          if availableDate.getTime() is slotDate.getTime()
            isAvalable = true

          if slotDate.getTime() - now.getTime() < 0
            isAvalable = false
            isPast = true

          businessHoursStart = new Date()
          businessHoursEnd = new Date()

          businessHoursMonth = @formatDate(date).split('-')[1] - 1
          businessHoursDate = @formatDate(date).split('-')[2]

          businessHoursStart.setMonth(businessHoursMonth)
          businessHoursStart.setDate(businessHoursDate)
          businessHoursEnd.setMonth(businessHoursMonth)
          businessHoursEnd.setDate(businessHoursDate)

          if typeof @businessHours[0] is 'number' or typeof @businessHours[0] is 'string'
            businessHoursStart.setHours(@businessHours[0][0], @businessHours[0][1], @businessHours[0][2], @businessHours[0][3])
            businessHoursEnd.setHours(@businessHours[1][0], @businessHours[1][1], @businessHours[1][2], @businessHours[1][3])

          if typeof @businessHours[0] is 'object'
            if @businessHours.length is 7
              currentBusinessHours = @businessHours[i][l]

              if currentBusinessHours isnt undefined and l < @businessHours[i].length
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

          if typeof @businessHours[0] is 'object'
            if slotDate.getTime() >= businessHoursEnd.getTime()
              if currentBusinessHours isnt undefined
                if @businessHours.length is 7
                  if l < @businessHours[i].length
                    l++
                else
                  if l < @businessHours.length
                    l++

        if isBusinessHours
          className += ' ats-time-slot__business-hours'

        if isPast
          className += ' ats-time-slot__past'
          isPast = false

        if not isAvalable
          mark = '<img src="' + @settings.iconFilePath + @settings.iconCross.fileName + '" width="' + @settings.iconCross.width + '" height="' + @settings.iconCross.height + '" />'
        else
          mark = '<img src="' + @settings.iconFilePath + @settings.iconCircle.fileName + '" width="' + @settings.iconCircle.width + '" height="' + @settings.iconCircle.height + '" />'
          className += ' ats-time-slot__available'

        if not isBusinessHours
          mark = ''

        tmpTimes += '<div class="' + className + '" data-time="' + ('0' + slotDate.getHours()).slice(-2) + ':' + ('0' + slotDate.getMinutes()).slice(-2) + '" data-date="' + @formatDate(date) + '">' + mark + '</div>'

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
    if typeof data is 'string'
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
        else

      request.onerror = ()->

      request.send()

    if typeof data is 'object'
      @settings.availabileTimeSlots = data.data

      @render()

  clearAvailableTimeSlots: ()->
    @settings.availabileTimeSlots = [[], [], [], [], [], [], []]

  clickPrevWeek: ()->
    currentDateTime = new Date(@getCurrentDate()).getTime()
    startDateTime = new Date(document.getElementById('ats-date-heading-0').getAttribute('data-date')).getTime()

    if startDateTime - currentDateTime < 0
      document.getElementById('ats-prev-week').classList.add('is-disable')

    document.getElementById('ats-prev-week').addEventListener('click', (e)=>
      @settings.startDate = @setDate(-7)
      @clearAvailableTimeSlots()
      @setAvailableTimeSlots(@settings.availabileTimeSlotResource)

      if typeof @settings.onClickNavigator is 'function'
        @settings.onClickNavigator(direction = 'prev')
    )

  clickNextWeek: ()->
    document.getElementById('ats-next-week').addEventListener('click', (e)=>
      @settings.startDate = @setDate(7)
      @clearAvailableTimeSlots()
      @setAvailableTimeSlots(@settings.availabileTimeSlotResource)

      document.getElementById('ats-prev-week').classList.remove('is-disable')

      if typeof @settings.onClickNavigator is 'function'
        @settings.onClickNavigator(direction = 'next')
    )

  clickAvailableTimeSlot: ()->
    Array.from(document.getElementsByClassName('ats-time-slot__available')).forEach((target)=>
      target.addEventListener('click', (e)=>
        date = target.getAttribute('data-date')
        time = target.getAttribute('data-time')
        tmp = date + ' ' + time
        if target.classList.contains('is-selected')
          target.classList.remove('is-selected')
          idx = @settings.selectedDates.indexOf(tmp)

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
    flatpickr('#ats-calendar', {
      wrap: true
      minDate: @formatDate(@initialStartDate)
    })

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

  render: ()->
    ret = '<div id="ats-container">
      <div id="ats-nav-container">' + @getNavigation() + '</div>'
    ret += '<div id="ats-week-container"'

    if @settings.scrollable
      ret += ' class="ats__scrollable"'

    ret += '>'
    ret += '<div id="ats-week-header">
    <div id="ats-dates-container">' + @getDatesHeader() + '</div>
    </div>
    <div id="ats-week-body">
    <div id="ats-times-container">' + @getTimeLine() + '</div>
    <div id="ats-available-time-container">' + @getAvailableTimeSlots() + '</div>
    </div>
    </div>
    </div>'

    @target.innerHTML = ret

    if @settings.holidays isnt ''
      @updateHoliday()

    @updateTimeSlot()

    if @settings.navigation
      @clickPrevWeek()
      @clickNextWeek()

    @clickAvailableTimeSlot()

    if @settings.scrollable
      @changeContainerHeight()

    if @settings.calendar
      @clickCalendar()

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