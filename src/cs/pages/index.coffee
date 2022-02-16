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
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      weekdays: ['日', '月', '火', '水', '木', '金', '土']
    }
    @settings = Object.assign({}, @defaults, options)
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
      tmpAvailTimes = ''

      for j in [0...@settings.availabileTimeSlots[i].length]
        tmpAvailTimes += '<a class="ats-available-time-slot" data-time="' + @settings.availabileTimeSlots[i][j] + '" data-date="' + @formatDate(@setDate(i)) + '">' + @settings.availabileTimeSlots[i][j] + '</a>'

      tmp += '<div class="ats-time-slot-container" id="ats-time-slot-container-' + i + '">' + tmpAvailTimes + '</div>'

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
    Array.from(document.getElementsByClassName('ats-available-time-slot')).forEach((target)=>
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
              Array.from(document.getElementsByClassName('ats-available-time-slot')).forEach((target)->
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
        <div id="ats-dates-container">' + @getDatesHeader() + '</div>
        <div id="ats-available-time-container">' + @getAvailableTimeSlots() + '</div>
      </div>
    </div>'

    @target.innerHTML = ret

    @clickPrevWeek()
    @clickNextWeek()
    @clickAvailableTimeSlot()
