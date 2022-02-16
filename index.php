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
    <script src="js/index.js"></script>
    <script>
      target = document.getElementById('app')
      
      settings = {
        availabileTimeSlots: [
          ['1:00', '2:00', '3:00', '4:00', '5:00'],
          ['2:00'],
          ['3:00'],
          ['4:00'],
          ['5:00'],
          ['6:00'],
          ['7:00']
        ],
        onClickNavigator: function() {
          var arr = [
            [
              ['4:00', '5:00', '6:00', '7:00', '8:00'],
              ['', '', '1:00', '5:00'],
              ['2:00', '5:00'],
              ['3:30'],
              ['2:00', '5:00'],
              ['2:00', '5:00'],
              ['2:00', '5:00']
            ],
            [
              ['2:00', '5:00'],
              ['4:00', '5:00', '6:00', '7:00', '8:00'],
              ['4:00', '5:00'],
              ['2:00', '5:00'],
              ['2:00', '5:00'],
              ['2:00', '5:00'],
              ['2:00', '5:00']
            ],
            [
              ['4:00', '5:00'],
              ['4:00', '5:00'],
              ['4:00', '5:00', '6:00', '7:00', '8:00'],
              ['3:00', '6:00'],
              ['3:00', '6:00'],
              ['3:00', '6:00'],
              ['3:00', '6:00']
            ],
            [
              ['4:00', '5:00'],
              ['4:00', '5:00'],
              ['4:00', '5:00'],
              ['4:00', '5:00', '6:00', '7:00', '8:00'],
              ['4:00', '5:00'],
              ['4:00', '5:00'],
              ['4:00', '5:00']
            ],
            [
              ['4:00', '6:00'],
              ['4:00', '6:00'],
              ['4:00', '6:00'],
              ['4:00', '6:00'],
              ['4:00', '5:00', '6:00', '7:00', '8:00'],
              ['4:00', '6:00'],
              ['4:00', '6:00']
            ],
            [
              ['3:00', '6:00'],
              ['3:00', '6:00'],
              ['3:00', '6:00'],
              ['3:00', '6:00'],
              ['3:00', '6:00'],
              ['4:00', '5:00', '6:00', '7:00', '8:00'],
              ['3:00', '6:00']
            ],
            [
              ['3:00', '4:00'],
              ['3:00', '4:00'],
              ['3:00', '4:00'],
              ['3:00', '4:00'],
              ['3:00', '4:00'],
              ['3:00', '4:00'],
              ['4:00', '5:00', '6:00', '7:00', '8:00']
            ]
          ]
          var rn = Math.floor(Math.random() * 10) % 7;
          AvailableTimeSlots.setAvailableTimeSlots(arr[rn]);
        }
      }
      
      AvailableTimeSlots = new AvailableTimeSlots(target, settings)
      
      AvailableTimeSlots.render()
    </script>
  </body>
</html>