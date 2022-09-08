# available-time-slots

[![Build](https://github.com/ysakmrkm/available-time-slots/actions/workflows/test.yml/badge.svg)](https://github.com/ysakmrkm/available-time-slots/actions/workflows/test.yml)

![gif](https://github.com/ysakmrkm/available-time-slots/blob/main/image/screenshot.gif)

## Overview

UI library of selectable available time slots

## Usage

```html
<link rel="stylesheet" href="../dist/css/styles.css">
<!-- if calendar option is true -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">

<div id="app"></div>

<script src="../dist/js/main.js"></script>
<script src="../dist/js/locales.js"></script>
<!-- if calendar option is true -->
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
<script>
	target = document.getElementById('app');

	AvailableTimeSlots = new AvailableTimeSlots(target);

	AvailableTimeSlots.init();
</script>
```

## Options

Default options are following.

```javascript
prevHtml = '<div id="ats-prev-week" class="ats-nav__item ats-nav__item__prev"><</div>';
nextHtml = '<div id="ats-next-week" class="ats-nav__item ats-nav__item__next">></div>';
{
	availabileTimeSlotResource: '',
	availabileTimeSlots: [[], [], [], [], [], [], []],
	isMultiple: false,
	navigation: true,
	prevElem: '',
	nextElem: '',
	selectedDates: [],
	startDate: new Date(),
	slotMinTime: '00:00',
	slotMaxTime: '24:00',
	slotSpan: 30,
	businessHours: [0,  23],
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
	displayAvailableCount: false,
	onClickTimeSlot: function(selectedDateArray){},
	onClickNavigator: function(clickNavigationDirection){}
}
```

## Dependency

If `calendar` option is `true`, nedd to use [flatpickr](https://github.com/flatpickr/flatpickr)

## More information

Official Site is [here](https://ysakmrkm.github.io/available-time-slots/)

## Author

[twitter](https://twitter.com/ysakmrkm)

## Licence

[MIT](https://github.com/ysakmrkm/available-time-slots/blob/main/LICENSE)