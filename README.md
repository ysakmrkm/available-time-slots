# available-time-slots

![gif](https://github.com/ysakmrkm/available-time-slots/blob/main/image/screenshot.gif)

## Overview

UI library of selectable available time slots

## Usage

```
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

## Dependency

If `calendar` option is `true`, nedd to use [flatpickr](https://github.com/flatpickr/flatpickr)

## Author

[twitter](https://twitter.com/ysakmrkm)

## Licence

[MIT](https://github.com/ysakmrkm/available-time-slots/blob/main/LICENSE)