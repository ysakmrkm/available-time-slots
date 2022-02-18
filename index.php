<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <title></title>
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="./css/styles.css">
  </head>
  <body class="index home" itemscope="itemscope" itemtype="http://schema.org/WebPage" id="index">
    <div id="app"></div>
    <p>選択枠<br><span id="selected-date"></span></p>
    <script src="js/index.js"></script>
    <script>
      target = document.getElementById('app')
      
      date = new Date()
      date.setDate(date.getDate() - 1)
      
      settings = {
        businessHour: [8,  19],
        availabileTimeSlotResource: './json/data.json',
        startDate: date,
        onClickTimeSlot: function(data) {
          document.getElementById('selected-date').innerHTML = ''
      
          data.forEach(function (data, index) {
            document.getElementById('selected-date').innerHTML += data+'<br>';
          });
        }
      }
      
      AvailableTimeSlots = new AvailableTimeSlots(target, settings)
      
      AvailableTimeSlots.init()
    </script>
  </body>
</html>