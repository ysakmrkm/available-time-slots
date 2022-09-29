target = document.getElementById('app')

date = new Date()
date.setDate(date.getDate() - 1)

datePicker = ''

settings = {
	businessHour: [8,  24],
	availabileTimeSlotResource: 'http://localhost:3001/json?start='+date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2),
	startDate: date,
	slotMinTime: '08:00',
	slotMaxTime: '24:00',
	slotSpan: 60,
	# businessHours: [9,  20],
	# businessHours: [[10,  14], [16, 22]],
	businessHours: [
		[[10,  24]]
		[[10,  14], [16, 22]],
		[[10,  14], [16, 22]],
		[[10,  14], [16, 22]],
		[[10,  14], [16, 22]],
		[[10,  14], [16, 22]],
		[[10,  24]],
	],
	holidays: 'https://holidays-jp.github.io/api/v1/date.json',
	scrollable: true,
	resizable: true,
	calendar: true,
	# view: 'onlyAvailableTimes',
	iconFilePath: 'sample/image/',
	displayAvailableCount: true,
	prevElem: '#prev'
	nextElem: '#next'
	# isMultiple: true
	initDatePicker: ()->
		# datePicker = flatpickr('#ats-calendar', {
		# 	wrap: true
		# 	minDate: date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
		# })
		datePicker = new Pikaday({
			field: document.getElementById('ats-calendar')
			minDate: date
		})
	destroyDatePicker: ()->
		datePicker.destroy()

	onClickTimeSlot: (data)->
		# console.log(data)
		document.getElementById('selected-date').innerHTML = ''

		data.forEach( (data, index)->
			document.getElementById('selected-date').innerHTML += data.date + ' ' + data.data.time + '<br>'
		)
}

AvailableTimeSlots = new AvailableTimeSlots(target, settings)

AvailableTimeSlots.init()
