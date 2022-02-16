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
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      weekdays: ['日', '月', '火', '水', '木', '金', '土']
    }
    @settings = Object.assign({}, @defaults, options)
    @startNum = (@settings.businessHour[0] * 60) / @settings.slotSpan
    @endNum = (@settings.businessHour[1] * 60) / @settings.slotSpan
    @onClick = @settings.onClick
    @onClickNavigator = @settings.onClickNavigator
    @target = target

  setDate: (days)->
    date = new Date(@settings.startDate.valueOf())
    date.setDate(date.getDate() + days)
    return date

  getYearName: (year)->
    return year + '年'

  getMonthName: (index)->
    return @settings.months[index]

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

  getTimeSlot: ()->
    tmp = ''

    for i in [@startNum...@endNum]
      tmp += '<div id="ats-time-slot-' + i + '" class="ats-time-slot">
      <div class="ats-time-slot-number">' + ('0' + @getCurrentTime(i).getHours()).slice(-2) + ':' + ('0' + @getCurrentTime(i).getMinutes()).slice(-2) + '</div>
      </div>'

    ret = tmp

    return ret

  getDatesHeader: ()->
    tmp = ''

    for i in [0...7]
      d = @setDate(i)

      tmp += '<div id="ats-date-heading-' + i + '" class="ats-date-heading">
        <div class="ats-date-number">' + d.getDate() + '</div>
        <div class="ats-date-text">' + @settings.weekdays[d.getDay()] + '</div>
      </div>'

    ret = tmp

    return ret

  getAvailableTimeSlots: ()->
    tmp = ''

    for i in [0...7]
      tmpTimes = ''
      mark = ''

      for j in [@startNum...@endNum]
        isAvalable = false

        for k in [0...@settings.availabileTimeSlots[i].length]
          availableDate = new Date(@getCurrentDate() + 'T' + @settings.availabileTimeSlots[i][k])

          if availableDate.getTime() is @getCurrentTime(j).getTime()
            isAvalable = true

        if not isAvalable
          mark = '×'
          className = 'ats-time-slot'
        else
          mark = '○'
          className = 'ats-time-slot ats-time-slot__available'

        tmpTimes += '<div class="' + className + '" data-time="' + ('0' + @getCurrentTime(j).getHours()).slice(-2) + ':' + ('0' + @getCurrentTime(j).getMinutes()).slice(-2) + '" data-date="' + @formatDate(@setDate(i)) + '">' + mark + '</div>'

      tmp += '<div class="ats-time-slot-container" id="ats-time-slot-container-' + i + '">' + tmpTimes + '</div>'

    return tmp

  setAvailableTimeSlots: (arr)->
    @settings.availabileTimeSlots = arr

    @render()

  clearAvailableTimeSlots: ()->
    @settings.availabileTimeSlots = [[], [], [], [], [], [], []]

  clickPrevWeek: ()->
    document.getElementById('ats-prev-week').addEventListener('click', (e)=>
      @settings.startDate = @setDate(-7)
      @clearAvailableTimeSlots()
      @render(@target)

      if typeof @onClickNavigator is 'function'
        @onClickNavigator()
    )

  clickNextWeek: ()->
    document.getElementById('ats-next-week').addEventListener('click', (e)=>
      @settings.startDate = @setDate(7)
      @clearAvailableTimeSlots()
      @render(@target)

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

        if typeof @onClick is 'function'
          @onClick()
      )
    )

  render: ()->
    ret = '<div id="ats-container">
      <div id="ats-nav-container">' + @getNavigation() + '</div>
      <div id="ats-week-container">
        <div id="ats-times-container">' + @getTimeSlot() + '</div>
        <div id="ats-dates-container">' + @getDatesHeader() + '</div>
        <div id="ats-available-time-container">' + @getAvailableTimeSlots() + '</div>
      </div>
    </div>'

    @target.innerHTML = ret

    @clickPrevWeek()
    @clickNextWeek()
    @clickAvailableTimeSlot()
