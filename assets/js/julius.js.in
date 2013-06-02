//
// Modulus operator, see:
//     http://javascript.about.com/od/problemsolving/a/modulobug.htm
//
Number.prototype.mod = function(n) {
  return ((this % n) + n) % n;
};

//
// Highchart theme.
//
// Based on:
//     Gray theme for Highcharts JS
//     Written by Torstein Hønsi.
//
Highcharts.theme = {
  colors: ['#DDDF0D', '#7798BF', '#55BF3B', '#DF5353', '#aaeeee', '#ff0066',
           '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
  chart: {
    borderWidth: 2,
    borderRadius: 0,
    plotBackgroundColor: null,
    plotShadow: false,
    plotBorderWidth: 0
  },
  title: {
    style: {
      color: '#333333',
      font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, ' +
          'Helvetica, sans-serif'
    }
  },
  xAxis: {
    gridLineWidth: 0,
    lineColor: '#666666',
    tickColor: '#666666',
    labels: {
      style: {
        color: '#666666',
        fontWeight: 'bold'
      }
    },
    title: {
      style: {
        color: '#333333',
        font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, ' +
            'Arial, Helvetica, sans-serif'
      }
    }
  },
  yAxis: {
    alternateGridColor: null,
    minorTickInterval: null,
    gridLineColor: '#666666',
    minorGridLineColor: '#666666',
    lineWidth: 0,
    tickWidth: 0,
    labels: {
      style: {
        color: '#666666',
        fontWeight: 'bold'
      }
    },
    title: {
      style: {
        color: '#333333',
        font: 'bold 12px Lucida Grande, Lucida Sans Unicode, Verdana, ' +
            'Arial, Helvetica, sans-serif'
      }
    }
  },
  legend: {
    itemStyle: {
      color: '#333333'
    },
    itemHoverStyle: {
      color: '#666666'
    },
    itemHiddenStyle: {
      color: '#666666'
    }
  },
  labels: {
    style: {
      color: '#CCC'
    }
  },
  tooltip: {
    backgroundColor: {
      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
      stops: [
        [0, 'rgba(96, 96, 96, .8)'],
        [1, 'rgba(16, 16, 16, .8)']
      ]
    },
    borderWidth: 0,
    style: {
      color: '#FFF'
    }
  },
  plotOptions: {
    series: {
      animation: false,
      shadow: true
    },
    line: {
      dataLabels: {
        color: '#CCC'
      },
      marker: {
        lineColor: '#333'
      }
    },
    spline: {
      marker: {
        lineColor: '#333'
      }
    },
    scatter: {
      marker: {
        lineColor: '#333'
      }
    },
    candlestick: {
      lineColor: 'white'
    }
  },
  toolbar: {
    itemStyle: {
      color: '#CCC'
    }
  },
  navigation: {
    buttonOptions: {
      symbolStroke: '#DDDDDD',
      hoverSymbolStroke: '#FFFFFF',
      theme: {
        fill: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0.4, '#606060'],
            [0.6, '#333333']
          ]
        },
        stroke: '#000000'
      }
    }
  },
  // scroll charts
  rangeSelector: {
    buttonTheme: {
      fill: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0.4, '#888'],
          [0.6, '#555']
        ]
      },
      stroke: '#000000',
      style: {
        color: '#CCC',
        fontWeight: 'bold'
      },
      states: {
        hover: {
          fill: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0.4, '#BBB'],
              [0.6, '#888']
            ]
          },
          stroke: '#000000',
          style: {
            color: 'white'
          }
        },
        select: {
          fill: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0.1, '#000'],
              [0.3, '#333']
            ]
          },
          stroke: '#000000',
          style: {
            color: 'yellow'
          }
        }
      }
    },
    inputStyle: {
      backgroundColor: '#333',
      color: 'silver'
    },
    labelStyle: {
      color: 'silver'
    }
  },
  navigator: {
    handles: {
      backgroundColor: '#666',
      borderColor: '#AAA'
    },
    outlineColor: '#CCC',
    maskFill: 'rgba(16, 16, 16, 0.5)',
    series: {
      color: '#7798BF',
      lineColor: '#A6C7ED'
    }
  },
  scrollbar: {
    barBackgroundColor: {
      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
      stops: [
        [0.4, '#888'],
        [0.6, '#555']
      ]
    },
    barBorderColor: '#CCC',
    buttonArrowColor: '#CCC',
    buttonBackgroundColor: {
      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
      stops: [
        [0.4, '#888'],
        [0.6, '#555']
      ]
    },
    buttonBorderColor: '#CCC',
    rifleColor: '#FFF',
    trackBackgroundColor: {
      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
      stops: [
        [0, '#000'],
        [1, '#333']
      ]
    },
    trackBorderColor: '#666'
  },
  // special colors for some of the demo examples
  legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
  legendBackgroundColorSolid: 'rgb(70, 70, 70)',
  dataLabelsColor: '#444',
  textColor: '#E0E0E0',
  maskColor: 'rgba(255,255,255,0.3)'
};

//
// We place everything in a Julius namespace.
//
var Julius = Julius || {};

(function() {
  'use strict';

  // Get the letter frequencies of the string `s`
  function freqCounts(s) {
    var counts = [];

    // Convert to upper case
    s = s.toUpperCase();

    // Initialise the results array
    for (var i = 0; i < 26; i++) {
      counts[String.fromCharCode(65 + i)] = 0;
    }

    // Populate the array
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i);
      var k = c.charCodeAt(0);

      // Count the character
      if (k >= 65 && k <= 90)
        counts[c]++;
    }

    return counts;
  }

  // Get the letter frequency distribution from a letter frequency set
  function freqDists(counts) {
    var dists = [];
    var total = 0;

    // Initialise the results array
    for (var i = 0; i < 26; i++) {
      var c = String.fromCharCode(65 + i);

      dists[c] = 0;
      total += counts[c];
    }

    // Get the distribution
    if (total > 0) {
      for (var i = 0; i < 26; i++) {
        var c = String.fromCharCode(65 + i);

        dists[c] = counts[c] / total;
      }
    }

    return dists;
  }

  // Shift alphabetic character `c` by index `n`. This does not affect
  // characters not in the range [A-za-z].
  function shiftChar(c, n) {
    var k = c.charCodeAt(0);

    if (k >= 65 && k <= 90) {
      // Upper case shift
      return String.fromCharCode((k - 65 + n).mod(26) + 65);
    } else if (k >= 97 && k <= 122) {
      // Lower case shift
      return String.fromCharCode((k - 97 + n).mod(26) + 97);
    } else {
      // Not in range [A-Za-z]
      return c;
    }
  }

  function getFitness(distribution, target) {
    var totalDiff = 0;

    for (var i = 0; i < 26; i++) {
      var d = distribution[i];
      var t = target[i];

      // Get the difference between the two distributions
      var diff = Math.abs(t - d);

      // Convert the diff into a ratio
      if (d > 0)
        diff /= d;
      else {
        if (t > 0)
          diff = 1;
        else
          diff = 0;
      }

      totalDiff += diff;
    }

    // Return the inverse diff
    return -totalDiff;
  }

  // Call shiftChar() on each character in the string `s`.
  function alphabeticShift(s, n) {
    var out = '';

    for (var i = 0; i < s.length; i++) {
      out += shiftChar(s.charAt(i), n);
    }

    return out;
  }

  //
  // Letter Frequency Distributions.
  //
  // Source: http://en.wikipedia.org/wiki/Letter_frequency
  var languageDistributions = [
    { name: 'Dutch', dist: [
      0.07486, // A
      0.01584, // B
      0.01242, // C
      0.05933, // D
      0.18914, // E
      0.00805, // F
      0.03403, // G
      0.02380, // H
      0.06499, // I
      0.01461, // J
      0.02248, // K
      0.03568, // L
      0.02213, // M
      0.10032, // N
      0.06063, // O
      0.01370, // P
      0.00009, // Q
      0.06411, // R
      0.03733, // S
      0.06923, // T
      0.02192, // U
      0.01854, // V
      0.01821, // W
      0.00036, // X
      0.00035, // Y
      0.01374  // Z
    ]}, { name: 'Esperanto', dist: [
      0.12117, // A
      0.00980, // B
      0.00776, // C
      0.03044, // D
      0.08995, // E
      0.01037, // F
      0.01171, // G
      0.00384, // H
      0.10012, // I
      0.03501, // J
      0.04163, // K
      0.06145, // L
      0.02994, // M
      0.07955, // N
      0.08779, // O
      0.02745, // P
      0.00000, // Q
      0.05914, // R
      0.06092, // S
      0.05276, // T
      0.03183, // U
      0.01904, // V
      0.00000, // W
      0.00000, // X
      0.00000, // Y
      0.00490  // Z
    ]}, { name: 'French', dist: [
      0.07636, // A
      0.00901, // B
      0.03260, // C
      0.03669, // D
      0.14715, // E
      0.01066, // F
      0.00866, // G
      0.00737, // H
      0.07529, // I
      0.00545, // J
      0.00049, // K
      0.05456, // L
      0.02968, // M
      0.07095, // N
      0.05378, // O
      0.02521, // P
      0.01362, // Q
      0.06553, // R
      0.07948, // S
      0.07244, // T
      0.06311, // U
      0.01628, // V
      0.00074, // W
      0.00427, // X
      0.00128, // Y
      0.00326  // Z
    ]}, { name: 'German', dist: [
      0.06516, // A
      0.01886, // B
      0.02732, // C
      0.05076, // D
      0.17396, // E
      0.01656, // F
      0.03009, // G
      0.04757, // H
      0.07550, // I
      0.00268, // J
      0.01417, // K
      0.03437, // L
      0.02534, // M
      0.09776, // N
      0.02594, // O
      0.00670, // P
      0.00018, // Q
      0.07003, // R
      0.07273, // S
      0.06154, // T
      0.04346, // U
      0.00846, // V
      0.01921, // W
      0.00034, // X
      0.00039, // Y
      0.01134  // Z
    ]}, {name: 'Italian', dist: [
      0.11745, // A
      0.00927, // B
      0.04501, // C
      0.03736, // D
      0.11792, // E
      0.01153, // F
      0.01644, // G
      0.00636, // H
      0.11283, // I
      0.00011, // J
      0.00009, // K
      0.06510, // L
      0.02512, // M
      0.06883, // N
      0.09832, // O
      0.03056, // P
      0.00505, // Q
      0.06367, // R
      0.04981, // S
      0.05623, // T
      0.03011, // U
      0.02097, // V
      0.00033, // W
      0.00000, // X
      0.00020, // Y
      0.01181  // Z
    ]}, { name: 'English', dist: [
      0.08167, // A
      0.01492, // B
      0.02782, // C
      0.04253, // D
      0.12702, // E
      0.02228, // F
      0.02015, // G
      0.06094, // H
      0.06966, // I
      0.00153, // J
      0.00772, // K
      0.04025, // L
      0.02406, // M
      0.06749, // N
      0.07507, // O
      0.01929, // P
      0.00095, // Q
      0.05987, // R
      0.06327, // S
      0.09056, // T
      0.02758, // U
      0.00978, // V
      0.02360, // W
      0.00150, // X
      0.01974, // Y
      0.00074  // Z
    ]}, { name: 'Polish', dist: [
      0.11503, // A
      0.01740, // B
      0.03895, // C
      0.04225, // D
      0.08352, // E
      0.00143, // F
      0.01731, // G
      0.01015, // H
      0.09328, // I
      0.01836, // J
      0.02753, // K
      0.03064, // L
      0.02515, // M
      0.06737, // N
      0.07167, // O
      0.02445, // P
      0.00000, // Q
      0.05743, // R
      0.06224, // S
      0.02475, // T
      0.02062, // U
      0.00000, // V
      0.06313, // W
      0.00000, // X
      0.03206, // Y
      0.05852  // Z
    ]}, { name: 'Portugese', dist: [
      0.14634, // A
      0.01043, // B
      0.03882, // C
      0.04992, // D
      0.12570, // E
      0.01023, // F
      0.01303, // G
      0.00781, // H
      0.06186, // I
      0.00397, // J
      0.00015, // K
      0.02779, // L
      0.04738, // M
      0.05046, // N
      0.10735, // O
      0.02523, // P
      0.01204, // Q
      0.06530, // R
      0.07805, // S
      0.04736, // T
      0.04634, // U
      0.01665, // V
      0.00037, // W
      0.00253, // X
      0.00006, // Y
      0.00470  // Z
    ]}, { name: 'Spanish', dist: [
      0.12525, // A
      0.02215, // B
      0.04139, // C
      0.05860, // D
      0.13681, // E
      0.00692, // F
      0.01768, // G
      0.00703, // H
      0.06247, // I
      0.00443, // J
      0.00011, // K
      0.04967, // L
      0.03157, // M
      0.06719, // N
      0.08683, // O
      0.02510, // P
      0.00877, // Q
      0.06871, // R
      0.07977, // S
      0.04632, // T
      0.03927, // U
      0.01138, // V
      0.00017, // W
      0.00215, // X
      0.01008, // Y
      0.00517  // Z
    ]}, { name: 'Swedish', dist: [
      0.09341, // A
      0.01254, // B
      0.01213, // C
      0.04521, // D
      0.09647, // E
      0.01931, // F
      0.03269, // G
      0.02103, // H
      0.07190, // I
      0.00652, // J
      0.03214, // K
      0.05229, // L
      0.03460, // M
      0.08796, // N
      0.04317, // O
      0.01437, // P
      0.00007, // Q
      0.08309, // R
      0.06374, // S
      0.08693, // T
      0.02066, // U
      0.02289, // V
      0.02107, // W
      0.00103, // X
      0.00601, // Y
      0.00020  // Z
    ]}, { name: 'Turkish', dist: [
      0.11680, // A
      0.02952, // B
      0.00970, // C
      0.04871, // D
      0.09007, // E
      0.00444, // F
      0.01340, // G
      0.01145, // H
      0.08274, // I
      0.00046, // J
      0.04715, // K
      0.05752, // L
      0.03745, // M
      0.07231, // N
      0.02653, // O
      0.00788, // P
      0.00000, // Q
      0.06948, // R
      0.02950, // S
      0.03049, // T
      0.03430, // U
      0.00977, // V
      0.00016, // W
      0.00007, // X
      0.03371, // Y
      0.01497  // Z
    ]}
  ];

  // The letter distributions of the input data
  var letterDistributions = [
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
  ];

  // Default to English
  var targetDistribution = languageDistributions[5].dist;

  var diff = 0;

  // Our page elements
  var textarea = $('#textarea');

  var shiftSlider = $('#shift-slider');
  var shiftLabel = $('#shift-label');
  var shiftAuto = $('#shift-auto');

  var langSlider = $('#lang-slider');
  var langLabel = $('#lang-label');
  var langAuto = $('#lang-auto');

  // We cache the starting shift value, so that shifts are performed relatively
  var cachedShift = 0;

  function setShift(n) {
    shiftLabel.text(n + ' shift');

    // Perform the shift
    textarea.val(alphabeticShift(textarea.val(), n - cachedShift));
    cachedShift = n;

    // Update the chart when we change shit
    refreshChart();
  }

  // Update the text area while we type
  textarea.bind('input propertychange', function() {
    if (textarea.val().length > 0) {
      shiftAuto.removeAttr('disabled');
      langAuto.removeAttr('disabled');
    } else {
      shiftAuto.attr('disabled', 'disabled');
      langAuto.attr('disabled', 'disabled');
    }

    // Update the frequency chart
    refreshChart();
  });

  // Auto button
  shiftAuto.click(function() {

    var shift = shiftSlider.slider('value') - 13;
    var bestShift = -13;
    var fittest;

    // Get the fittest shift
    for (var i = 0; i < 26; i++) {
      var text = alphabeticShift(textarea.val(), i - 13 - shift);
      var counts = freqCounts(text);
      var dists = freqDists(counts);
      var d = [];

      for (var j = 0; j < 26; j++) {
        d.push(dists[String.fromCharCode(65 + j)]);
      }

      var f = getFitness(d, targetDistribution);

      if (!i)
        fittest = f;
      else {
        // Set fittest
        if (f > fittest) {
          bestShift = i - 13;
          fittest = f;
        }
      }
    }

    // Set the fittest shift and update
    shiftSlider.slider('value', bestShift + 13);
    setShift(bestShift);
  });

  // Refresh the chart data and draw
  function refreshChart() {
    var counts = freqCounts(textarea.val());
    var dists = freqDists(counts);

    var d = [];
    for (var i = 0; i < 26; i++) {
      d.push(dists[String.fromCharCode(65 + i)]);
    }

    letterDistributions = d;
    diff = getFitness(letterDistributions, targetDistribution);

    drawChart();
  }

  // Draw the chart
  function drawChart() {
    $('#container').highcharts({
      chart: {
        type: 'area'
      },
      title: {
        text: 'Letter Frequency Distribution'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        labels: {
          formatter: function() {
            return String.fromCharCode(65 + this.value);
          }
        },
        tickInterval: 1
      },
      yAxis: {
        labels: {
          formatter: function() {
            return this.value * 100 + '%';
          }
        }
      },
      tooltip: {
        formatter: function() {
          return String.fromCharCode(65 + this.point.x) + ': ' +
              (this.point.y * 100).toFixed(2) + '%';
        }
      },
      plotOptions: {
        area: {
          pointStart: 0,
          marker: {
            enabled: false,
            symbol: 'circle',
            radius: 2,
            states: {
              hover: {
                enabled: true
              }
            }
          }
        }
      },
      series: [{
        name: 'Language average',
        data: targetDistribution
      }, {
        name: 'Actual',
        data: letterDistributions
      }]
    });
  }

  // Document ready preparations
  this.init = function() {

    // Disable buttons
    shiftAuto.attr('disabled', 'disabled');
    langAuto.attr('disabled', 'disabled');

    // Set keyboard focus on the text area
    textarea.focus();

    // Set the theme
    var highchartsOptions = Highcharts.setOptions(Highcharts.theme);

    // Draw the empty chart
    drawChart();

    // Setup the shift slider
    shiftSlider.slider({
      range: 'min',
      min: 0,
      max: 26,
      step: 1,
      value: 13,

      // Slider change callback
      slide: function(event, ui) {
        setShift(ui.value - 13);
      }
    });

    // Setup the shift slider
    langSlider.slider({
      range: 'min',
      min: 0,
      max: languageDistributions.length - 1,
      step: 1,
      value: 5,

      // Slider change callback
      slide: function(event, ui) {
        targetDistribution = languageDistributions[ui.value].dist;
        langLabel.text(languageDistributions[ui.value].name);
        refreshChart();
      }
    });
  };

}).call(Julius);

// Call our init function when ready.
window.onload = Julius.init;
