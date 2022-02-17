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
      
      settings = {
        businessHour: [8,  19],
        availabileTimeSlots: [
          ['08:00', '09:30', '10:00', '11:30', '12:00', '17:00', '18:30'],
          ['09:00', '12:30'],
          ['11:00'],
          ['08:30'],
          ['08:30', '11:00', '12:00'],
          ['09:00', '11:30'],
          ['10:30', '12:00']
        ],
        onClickNavigator: function() {
          var arr = [
            [
              ['04:00', '05:00', '06:00', '07:00', '08:00'],
              ['01:00', '05:00'],
              ['02:00', '05:00'],
              ['03:30'],
              ['02:00', '05:00'],
              ['02:00', '05:00'],
              ['02:00', '05:00']
            ],
            [
              ['02:00', '05:00'],
              ['04:00', '05:00', '06:00', '07:00', '08:00'],
              ['04:00', '05:00'],
              ['02:00', '05:00'],
              ['02:00', '05:00'],
              ['02:00', '05:00'],
              ['02:00', '05:00']
            ],
            [
              ['04:00', '05:00'],
              ['04:00', '05:00'],
              ['04:00', '05:00', '06:00', '07:00', '08:00'],
              ['03:00', '06:00'],
              ['03:00', '06:00'],
              ['03:00', '06:00'],
              ['03:00', '06:00']
            ],
            [
              ['04:00', '05:00'],
              ['04:00', '05:00'],
              ['04:00', '05:00'],
              ['04:00', '05:00', '06:00', '07:00', '08:00'],
              ['04:00', '05:00'],
              ['04:00', '05:00'],
              ['04:00', '05:00']
            ],
            [
              ['04:00', '06:00'],
              ['04:00', '06:00'],
              ['04:00', '06:00'],
              ['04:00', '06:00'],
              ['04:00', '05:00', '06:00', '07:00', '08:00'],
              ['04:00', '06:00'],
              ['04:00', '06:00']
            ],
            [
              ['03:00', '06:00'],
              ['03:00', '06:00'],
              ['03:00', '06:00'],
              ['03:00', '06:00'],
              ['03:00', '06:00'],
              ['04:00', '05:00', '06:00', '07:00', '08:00'],
              ['03:00', '06:00']
            ],
            [
              ['03:00', '04:00'],
              ['03:00', '04:00'],
              ['03:00', '04:00'],
              ['03:00', '04:00'],
              ['03:00', '04:00'],
              ['03:00', '04:00'],
              ['04:00', '05:00', '06:00', '07:00', '08:00']
            ]
          ]
          var rn = Math.floor(Math.random() * 10) % 7;
          AvailableTimeSlots.setAvailableTimeSlots(arr[rn]);
        },
        onClickTimeSlot: function(data) {
          document.getElementById('selected-date').innerHTML = ''
      
          data.forEach(function (data, index) {
            document.getElementById('selected-date').innerHTML += data+'<br>';
          });
        }
      }
      
      AvailableTimeSlots = new AvailableTimeSlots(target, settings)
      
      AvailableTimeSlots.render()
    </script>
  </body>
</html>