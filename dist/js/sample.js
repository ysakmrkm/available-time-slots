var AvailableTimeSlots, date, settings, target;

target = document.getElementById('app');

date = new Date();

date.setDate(date.getDate() - 1);

settings = {
  businessHour: [8, 24],
  availabileTimeSlotResource: 'http://localhost:3001/json?start=' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2),
  startDate: date,
  slotMinTime: '08:00',
  slotMaxTime: '24:00',
  slotSpan: 60,
  // businessHours: [9,  20],
  // businessHours: [[10,  14], [16, 22]],
  businessHours: [[[10, 24]], [[10, 14], [16, 22]], [[10, 14], [16, 22]], [[10, 14], [16, 22]], [[10, 14], [16, 22]], [[10, 14], [16, 22]], [[10, 24]]],
  holidays: 'https://holidays-jp.github.io/api/v1/date.json',
  scrollable: true,
  resizable: true,
  calendar: true,
  // view: 'onlyAvailableTimes',
  iconFilePath: 'sample/image/',
  displayAvailableCount: true,
  prevElem: '#prev',
  nextElem: '#next',
  // isMultiple: true
  onClickTimeSlot: function(data) {
    // console.log(data)
    document.getElementById('selected-date').innerHTML = '';
    return data.forEach(function(data, index) {
      return document.getElementById('selected-date').innerHTML += data.date + ' ' + data.data.time + '<br>';
    });
  }
};

AvailableTimeSlots = new AvailableTimeSlots(target, settings);

AvailableTimeSlots.init();

//# sourceMappingURL=sample.js.map
