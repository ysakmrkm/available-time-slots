class AvailableTimeSlots
  constructor: (target, options)->
    @prevHtml = '<div id="ats-prev-week" class="ats-nav__item"><</div>'
    @nextHtml = '<div id="ats-next-week" class="ats-nav__item">></div>'
    @defaults = {
      availabileTimeSlots: [[], [], [], [], [], [], []],
      isMultiple: false
      prevHtml: @prevHtml
      nextHtml: @nextHtml
      selectedDates: []
      startDate: new Date()
      slotSpan: 30
      businessHour: [0,  23]
      months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
      weekdays: ['日', '月', '火', '水', '木', '金', '土']
      holidays: 'https://holidays-jp.github.io/api/v1/date.json'
    }
    @settings = Object.assign({}, @defaults, options)
    @startNum = (@settings.businessHour[0] * 60) / @settings.slotSpan
    @endNum = (@settings.businessHour[1] * 60) / @settings.slotSpan
    @onClickTimeSlot = @settings.onClickTimeSlot
    @onClickNavigator = @settings.onClickNavigator
    @target = target

  setDate: (days)->
    date = new Date(@settings.startDate.valueOf())
    date.setDate(date.getDate() + days)
    return date

  getYearName: (year)->
    return year + '年'

  getMonthName: (index)->
    return @settings.months[index] + '月'

  getWeekdayName: (index)->
    return '（' + @settings.weekdays[index] + '）'

  formatDate: (data)->
    date = '' + data.getDate()
    month = '' + (data.getMonth() + 1)
    year = data.getFullYear()

    if date.length < 2
      date = '0' + date

    if month.length < 2
      month = '0' + month

    return year + '-' + month + '-' + date

  getNavigation: ()->
    previousWeekHtml = '<div id="ats-prev-week-container" class="ats-nav">' + @settings.prevHtml + '</div>'
    nextWeekHtml = '<div id="ats-prev-week-container" class="ats-nav">' + @settings.nextHtml + '</div>'
    dateHtml = '<div id="ats-current-date-container">' + @getYearName(@settings.startDate.getFullYear()) + ' ' + @getMonthName(@settings.startDate.getMonth()) + '</div>'
    navHtml = previousWeekHtml + ' ' + dateHtml + ' ' + nextWeekHtml

    return navHtml

  getCurrentDate: ()->
    now = new Date()
    nowDateTime = now.toISOString()
    nowDate = nowDateTime.split('T')[0]

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

        className = 'ats-time-slot'

        for k in [0...@settings.availabileTimeSlots[i].length]
          availableDate = new Date(date.toISOString().split('T')[0] + 'T' + @settings.availabileTimeSlots[i][k])
          slotDate = new Date(date.toISOString().split('T')[0] + 'T' + ('0' + @getCurrentTime(j).getHours()).slice(-2) + ':' + ('0' + @getCurrentTime(j).getMinutes()).slice(-2))

          if availableDate.getTime() is slotDate.getTime()
            isAvalable = true

          if slotDate.getTime() - now.getTime() < 0
            isAvalable = false
            isPast = true

        if isPast
          className += ' ats-time-slot__past'
          isPast = false

        if not isAvalable
          mark = '×'
        else
          mark = '○'
          className += ' ats-time-slot__available'

        tmpTimes += '<div class="' + className + '" data-time="' + ('0' + @getCurrentTime(j).getHours()).slice(-2) + ':' + ('0' + @getCurrentTime(j).getMinutes()).slice(-2) + '" data-date="' + @formatDate(date) + '">' + mark + '</div>'

      className = 'ats-time-slot-container'

      if date.getDay() is 0
        className += ' ats__sunday'
      else if date.getDay() is 6
        className += ' ats__saturday'
      else
        className += ' ats__weekday'

      tmp += '<div id="ats-time-slot-container-' + i + '" class="' + className + '">' + tmpTimes + '</div>'

    return tmp

  setAvailableTimeSlots: (arr)->
    @settings.availabileTimeSlots = arr

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
      @render()

      if typeof @onClickNavigator is 'function'
        @onClickNavigator()
    )

  clickNextWeek: ()->
    document.getElementById('ats-next-week').addEventListener('click', (e)=>
      @settings.startDate = @setDate(7)
      @clearAvailableTimeSlots()
      @render()

      document.getElementById('ats-prev-week').classList.remove('is-disable')

      if typeof @onClickNavigator is 'function'
        @onClickNavigator()
    )

  clickAvailableTimeSlot: ()->
    Array.from(document.getElementsByClassName('ats-time-slot__available')).forEach((target)=>
      target.addEventListener('click', (e)=>
        date = target.getAttribute('data-date')
        time = target.getAttribute('data-time')
        tmp = date + ' ' + time
        if target.classList.contains('selected')
          target.classList.remove('selected')
          idx = @settings.selectedDates.indexOf(tmp)
          if idx isnt -1
            @settings.selectedDates.splice(idx, 1)
        else
          if @settings.isMultiple
            target.classList.add('selected')
            @settings.selectedDates.push(tmp)
          else
            @settings.selectedDates.pop()
            if not @settings.selectedDates.length
              Array.from(document.getElementsByClassName('ats-time-slot__available')).forEach((target)->
                target.classList.remove('selected')
              )

              target.classList.add('selected')
              @settings.selectedDates.push(tmp)

        if typeof @onClickTimeSlot is 'function'
          @onClickTimeSlot(@settings.selectedDates)
      )
    )

  render: ()->
    ret = '<div id="ats-container">
      <div id="ats-nav-container">' + @getNavigation() + '</div>
      <div id="ats-week-container">
        <div id="ats-times-container">' + @getTimeLine() + '</div>
        <div id="ats-dates-container">' + @getDatesHeader() + '</div>
        <div id="ats-available-time-container">' + @getAvailableTimeSlots() + '</div>
      </div>
    </div>'

    @target.innerHTML = ret

    if @settings.holidays isnt ''
      @updateHoliday()

    @clickPrevWeek()
    @clickNextWeek()
    @clickAvailableTimeSlot()

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