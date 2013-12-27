---
---

{% include typeset.js %}
{% include hypher.js %}

/*
 * Perform typesetting. Based on typeset/examples/flatland/index.html.
 */
jQuery(function ($) {
  var lineLength = 0,
      lineHeight = 0,
      lineLengths = [],
      tmp, ruler,
      h = new Hypher(Hypher.en),
      cache = {};

  var linebreak = Typeset.linebreak;

  function measureString(str) {
    if (!cache[str]) {
      ruler[0].firstChild.nodeValue = str;
      cache[str] = ruler[0].offsetWidth;
    }
    return cache[str];
  }

  lineLength = $('section').width();

  ruler = $('<div class="ruler">&nbsp;</div>').css({
    visibility: 'hidden',
    position: 'absolute',
    top: '-8000px',
    width: 'auto',
    display: 'inline',
    left: '-8000px'
  });

  $('body').append(ruler);

  var   space = {
    width: 0,
    stretch: 0,
    shrink: 0
  },
      hyphenWidth = measureString('-'),
      hyphenPenalty = 100;

  // Calculate the space widths based on our font preferences
  space.width = ruler.html('&nbsp;').width();
  space.stretch = (space.width * 3) / 6;
  space.shrink = (space.width * 3) / 9;

  lineHeight = parseFloat(ruler.html('Hello World').css('lineHeight'));

  $('section').each(function () {
    $(this).find('p, img').each(function (index, element) {
      var paragraph,
          nodes = [],
          breaks = [],
          output = [],
          lines = [],
          words,
          carryOver = null,
          i, point, r, lineStart,
          iterator,
          token, hyphenated;

      if (element.nodeName.toUpperCase() === 'P') {
        paragraph = $(element);

        /* Indent the first line of each paragraph after the first: */
        // if (index !== 0) {
        //   nodes.push(linebreak.box(30, ''));
        // }

        words = paragraph.text().split(/\s/);

        words.forEach(function (word, index, array) {
          var hyphenated = [];
          if (word.length > 6) {
            hyphenated = h.hyphenate(word, 'en');
          }

          if (hyphenated.length > 1) {
            hyphenated.forEach(function (part, partIndex, partArray) {
              nodes.push(linebreak.box(measureString(part), part));
              if (partIndex !== partArray.length - 1) {
                nodes.push(linebreak.penalty(hyphenWidth, hyphenPenalty, 1));
              }
            });
          } else {
            nodes.push(linebreak.box(measureString(word), word));
          }

          if (index === array.length - 1) {
            nodes.push(linebreak.glue(0, linebreak.infinity, 0));
            nodes.push(linebreak.penalty(0, -linebreak.infinity, 1));
          } else {
            nodes.push(linebreak.glue(space.width, space.stretch, space.shrink));
          }
        });

        // Perform the line breaking
        breaks = linebreak(nodes, lineLengths.length !== 0 ? lineLengths : [lineLength], {tolerance: 1});

        // Try again with a higher tolerance if the line breaking failed.
        if (breaks.length === 0) {
          breaks = linebreak(nodes, lineLengths.length !== 0 ? lineLengths : [lineLength], {tolerance: 2});
          // And again
          if (breaks.length === 0) {
            breaks = linebreak(nodes, lineLengths.length !== 0 ? lineLengths : [lineLength], {tolerance: 3});
          }
        }

        // Build lines from the line breaks found.
        for (i = 1; i < breaks.length; i += 1) {
          point = breaks[i].position,
          r = breaks[i].ratio;

          for (var j = lineStart; j < nodes.length; j += 1) {
            // After a line break, we skip any nodes unless they are boxes or forced breaks.
            if (nodes[j].type === 'box' || (nodes[j].type === 'penalty' && nodes[j].penalty === -linebreak.infinity)) {
              lineStart = j;
              break;
            }
          }
          lines.push({ratio: r, nodes: nodes.slice(lineStart, point + 1), position: point});
          lineStart = point;
        }

        lines.forEach(function (line, lineIndex, lineArray) {
          var   indent = false,
              spaces = 0,
              totalAdjustment = 0,
              wordSpace = line.ratio * (line.ratio < 0 ? space.shrink : space.stretch),
              integerWordSpace = Math.round(wordSpace),
              adjustment = wordSpace - integerWordSpace,
              integerAdjustment = adjustment < 0 ? Math.floor(adjustment) : Math.ceil(adjustment),
              tmp = [];

          // Iterate over the nodes in each line and build a temporary array containing just words, spaces, and soft-hyphens.
          line.nodes.forEach(function (n, index, array) {
            // normal boxes
            if (n.type === 'box' && n.value !== '') {
              if (tmp.length !== 0 && tmp[tmp.length - 1] !== '&nbsp;') {
                tmp[tmp.length - 1] += n.value;
              } else {
                tmp.push(n.value);
              }
              // empty boxes (indentation for example)
            } else if (n.type === 'box' && n.value === '') {
              output.push('<span style="margin-left: 30px;"></span>');
              // glue inside a line
            } else if (n.type === 'glue' && index !== array.length - 1) {
              tmp.push('&nbsp;');
              spaces += 1;
              // glue at the end of a line
            } else if (n.type === 'glue') {
              tmp.push(' ');
              // hyphenated word at the end of a line
            } else if (n.type === 'penalty' && n.penalty === hyphenPenalty && index === array.length - 1) {
              tmp.push('&shy;');
              // Remove trailing space at the end of a paragraph
            } else if (n.type === 'penalty' && index === array.length - 1 && tmp[tmp.length - 1] === '&nbsp;') {
              tmp.pop();
            }
          });

          totalAdjustment = Math.round(adjustment * spaces);

          // If the line ends at a soft hyphen we need to do something special as Webkit doesn't properly handle <span>hy&shy;</span><span>phen</span>.
          if (tmp[tmp.length - 1] === '&shy;') {
            if (totalAdjustment !== 0) {
              output.push('<span style="word-spacing: ' + (integerWordSpace + integerAdjustment) + 'px;">' + (carryOver ? carryOver : '') + tmp.slice(0, Math.abs(totalAdjustment) * 2).join('') + '</span>');
              output.push('<span style="word-spacing: ' + integerWordSpace + 'px;">' + tmp.slice((Math.abs(totalAdjustment) * 2), -2).join('') + '</span>');
            } else {
              output.push('<span style="word-spacing: ' + integerWordSpace + 'px;">' + (carryOver ? carryOver : '') + tmp.slice(0, -2).join('') + "</span>");
            }
            carryOver = tmp.slice(-2).join('');
          } else {
            if (totalAdjustment !== 0) {
              output.push('<span style="word-spacing: ' + (integerWordSpace + integerAdjustment) + 'px;">' + (carryOver ? carryOver : '') + tmp.slice(0, Math.abs(totalAdjustment) * 2).join('') + '</span>');
              output.push('<span style="word-spacing: ' + integerWordSpace + 'px;">' + tmp.slice(Math.abs(totalAdjustment) * 2).join('') + '</span>');
            } else {
              output.push('<span style="word-spacing: ' + integerWordSpace + 'px;">' + (carryOver ? carryOver : '') + tmp.join('') + "</span>");
            }
            carryOver = null;
          }
        });

        paragraph.empty();
        paragraph.append(output.join(''));
        currentWidth = lineLength;

        lineLengths = lineLengths.slice(lines.length);
      } else {
        tmp = (lineLength - $(element).outerWidth(true));
        for (i = 0; i < Math.ceil($(element).outerHeight(true) / lineHeight); i += 1) {
          lineLengths.push(tmp);
        }
        lineLengths.push(lineLength);
      }
    });
  });
});
