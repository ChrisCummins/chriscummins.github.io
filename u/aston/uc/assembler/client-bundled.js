(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) {
          return a(o, !0);
        }
        if (i) {
          return i(o, !0);
        }
        throw new Error("Cannot find module '" + o + "'")
      }
      var f = n[o] = {exports: {}};
      t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, f, f.exports, e, t, n, r)
    }
    return n[o].exports
  }

  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }
  return s
})({
  1: [function (require, module, exports) {
    var u = require('./lib/ee4dsa-util');
    var assemble = require('./lib/ee4dsa-assembler');

// HTML elements
    var $code = $('#code');
    var $errors = $('#errors');
    var $outputRam = $('#output-ram');
    var $outputList = $('#output-list');

// Internal state
    var _ramSize = 1024
    var _idtSize = 8;
    var _annotate = true;

// Add a new visible error
    var addError = function (msg) {
      $errors.append("<div class=\"alert alert-error\">" + msg +
          "<a class=\"close\" data-dismiss=\"alert\" " +
          "href=\"#\">&times;</a></div>");
    };

// Add a new visible error
    var addMessage = function (msg) {
      $errors.append("<div class=\"alert alert-success\">" + msg +
          "<a class=\"close\" data-dismiss=\"alert\" " +
          "href=\"#\">&times;</a></div>");
    };

    var updateView = function () { // Display errors
      $errors.html('');
      $outputRam.text('');
      $outputList.text('');

      assemble($code.val(), {
        size: _ramSize,
        idtSize: _idtSize,
        annotate: _annotate
      }, function (err, data) {
        if (err) // Show errors
        {
          addError(err);
        } else if (data.prog.cseg_size + data.prog.dseg_size
            > data.prog.idt_size) {
          addMessage('Assembled ' + (data.prog.cseg_size + data.prog.dseg_size)
              +
              ' words, ' + u.perc(data.prog.util, 3) + ' util ' +
              '(cseg: ' + u.perc(data.prog.cseg_util / data.prog.util, 0) +
              ' dseg: ' + u.perc(data.prog.dseg_util / data.prog.util, 0) +
              ')');
        }

        $outputRam.text(data.ram);
        $outputList.text(data.list);
      });
    };

// Update as the user types
    $code.bind('input propertychange', function () {
      updateView();
    });

    $('#ram-size').change(function () {
      _ramSize = parseInt($('#ram-size option:selected').val());
      updateView();
    });

    $('#idt-size').change(function () {
      _idtSize = parseInt($('#idt-size option:selected').val());
      updateView();
    });

    $('#annotate').change(function () {
      _annotate = parseInt($('#annotate option:selected').val());
      updateView();
    });

    updateView();

  }, {"./lib/ee4dsa-assembler": 2, "./lib/ee4dsa-util": 3}],
  2: [function (require, module, exports) {
    /*
     * data - String
     * options - Object
     *    annotate - Boolean, whether to generate annotated list
     *    size - Number
     *    idtSize - Number
     * callback - Function(err, data)
     */
    module.exports = function (data, options, callback) {

      var u = require('./ee4dsa-util');

      /*
       * Compose an input data file into an assembly source, stripping
       * comments and whitespace.
       */
      var data2source = function (data) {
        var lines = data.split(/\n/), outLines = [];

        for (var i = 0; i < lines.length; i++) {
          var words = lines[i].split(/\s+/), outWords = [];

          for (var j = 0; j < words.length; j++) {
            var word = words[j];

            if (word.match(/^;/)) {
              break;
            }

            if (word !== '') {
              outWords.push(word);
            }
          }

          if (outWords.length) {
            outLines.push(outWords.join(' '));
          }
        }

        return outLines.join('\n');
      };

      /*
       * Recursively expand macro from table
       *
       *   word - a string
       *   symbols - an array of maps of symbol/value pairs
       *   data - user data for dynamic symbol expansion
       */
      var resolveSymbols = function (word, symbols, data) {
        for (var i in symbols) {
          if (symbols[i][word] !== undefined) {
            // Either call dynamic symbol function or lookup static symbol
            var value = typeof symbols[i][word] === 'function' ?
                symbols[i][word](data) : symbols[i][word];

            // Recurse
            return resolveSymbols(value, symbols, data);
          }
        }

        return '' + word;
      };

      /* Resolve expressions within a set of tokens */
      var resolveExpressions = function (tokens) {
        var t = [], token, match, opA = '', operators = [];

        // Iterate over every token
        for (var i = 0; i < tokens.length; i++) {
          token = new String(tokens[i]);

          // Convert Hex digits to numbers
          if (token.match(/^0x[0-9a-f]+$/)) {
            var n = parseInt(token.replace(/^0x/, ''), 16);

            if (!isNaN(n)) {
              token = n;
            }
          } else if (token.match(/^0b[01]+$/)) {
            var n = parseInt(token.replace(/^0b/, ''), 2);

            if (!isNaN(n)) {
              token = n;
            }
          } else if (token.match(/^[-+]?[0-9]+$/)) {
            // Convert numbers to numbers
            var n = parseInt(token);

            if (!isNaN(n)) {
              token = n;
            }
          } else if ((match = token.match(/^(~)(.+)/))) {
            // Calculate bitwise complements
            var n = new Number(match[2]);

            if (!isNaN(n)) {
              token = eval(match[1] + n);
            }
          }

          // Hunt for the first numerical token
          if (operators.length < 1 && typeof token === 'number' && i
              < tokens.length - 2) {
            if (opA !== '') // Flush out a previous operand
            {
              t.push('' + opA);
            }

            opA = token;
          } else if (opA !== '' && token.toString().match(
              /^([\+\-\*^\/|&^]|(>>)|(<<))$/) && i < tokens.length - 1) {
            operators.push('' + token);
          } else if (opA !== '' && typeof token === 'number' && operators.length
              > 0) {
            t.push('' + eval('(' + opA + ')' + ' ' + operators.join(' ') + ' ('
                + token + ')'));
            return resolveExpressions(t.concat(tokens.slice(i + 1)))
          } else {
            if (opA !== '') {
              t.push(opA);
            }
            if (operators.length) {
              t.push(operators.join(' '));
            }

            opA = '', operators = [];

            t.push('' + token);
          }
        }

        return t;
      };

      /*
       * Tokenize a string
       *
       *   str - string to tokenize
       *   symbols - (optional) an array of maps of symbol/value pairs
       *   data - (optional) user data for performing dynamic symbol expansion
       */
      var tokenize = function (str, symbols, data) {
        symbols = symbols || [[]];
        data = data || {};
        var tokens = [];

        /*
         * The expandToken flag is used to determine whether to lookup the
         * current token in the macro table or to skip it. This is needed
         * for the symbol directives (.DEF, .UNDEF, etc), which requires the
         * argument token to be interpreted literally so as to be removed
         * from the macro table.
         */
        var expandToken = true;

        // Split str into words
        str.split(/[ 	]+/).forEach(function (token) {

          // Remove commas
          token = token.replace(/,$/, '');

          if (expandToken && typeof token.match === 'function') {
            // Resolve symbols, ignoring valid prefixes and suffixes
            var match = token.match(/^([\+\-~]?)([^:]+)([:]?)/);

            token = match[1] + resolveSymbols(match[2], symbols, data)
                + match[3];
          } else {
            expandToken = true;
          }

          // Don't expand the token after symbol directives
          if (token.match(/\.(def)|(defp)|(undef)/)) {
            expandToken = false;
          }

          if (token !== '') {
            tokens.push(token);
          }
        });

        // Resolve numerical expressions
        tokens = resolveExpressions(tokens);

        return tokens;
      };

      /*
       * Pre-process the text by recursively expanding macro instructions.
       */
      var preProcess = function (text) {
        var processed = text
        // Branch if equal
        .replace(/(^|\s)breq\s+([^,]+),\s+([^,]+),\s+(.+)/,
            '$1equ $2, $3\n' +
            'brts $4')
        // Branch if equal immediate
        .replace(/(^|\s)breqi\s+([^,]+),\s+([^,]+),\s+(.+)/,
            '$1ldi __r, $3\n' +
            'equ $2, __r\n' +
            'brts $4')
        // Branch if not equal
        .replace(/(^|\s)brne\s+([^,]+),\s+([^,]+),\s+(.+)/,
            '$1neq $2, $3\n' +
            'brts $4')
        // Branch if less than / greater than (equal)
        .replace(/(^|\s)br(lt|lte|gt|gte)\s+([^,]+),\s+([^,]+),\s+(.+)/,
            '$1$2 $3, $4\n' +
            'brts $5')
        // Branch if not equal immediate
        .replace(/(^|\s)brnei\s+([^,]+),\s+([^,]+),\s+(.+)/,
            '$1ldi __r, $3\n' +
            'neq $2, __r\n' +
            'brts $4')
        // Store (indirect) immediate
        .replace(/(^|\s)st(r?)i\s+([^,]+),\s+(.+)/,
            '$1ldi __r, $4\n' +
            'st$2 $3, __r')
        // Store indirect offset immediate
        .replace(/(^|\s)stdi\s+([^,]+),\s+([^,]+),\s+(.+)/,
            '$1ldi __r, $3\n' +
            'std $2, __r, $4')
        // Push immediate
        .replace(/(^|\s)pshi\s+(.+)/,
            '$1ldi __r, $2\n' +
            'pshr __r')
        // Load immediate
        .replace(/(^|\s)ldi\s+([^,]+),\s+(.+)/,
            '$1ldih $2, $3 >> 16\n' +
            'ldil $2, $3')
        // Load indirect to register
        .replace(/(^|\s)lddi\s+([^,]+),\s+([^,]+),\s+(.+)/,
            '$1ldi __r, $4\n' +
            'ldd $2, $3, __r')
        // Equals immediate
        .replace(/(^|\s)eqi\s+([^,]+),\s+(.+)/,
            '$1ldi __r, $3\n' +
            'equ $2, __r')
        // Not equals immediate
        .replace(/(^|\s)neqi\s+([^,]+),\s+(.+)/,
            '$1ldi __r, $3\n' +
            'neq $2, __r')
        // Less than / Great than (or equal) (signed) immediate
        .replace(/(^|\s)(lt|gt)(e?)(s?)i\s+([^,]+),\s+(.+)/,
            '$1ldi __r, $6\n' +
            '$2$3$4 $5, __r')
        // Add / Subtract (signed) immediate
        .replace(/(^|\s)(add|sub)(s?)i\s+([^,]+),\s+([^,]+),\s+(.+)/,
            '$1ldi __r, $6\n' +
            '$2$3 $4, $5, __r')
        // AND / OR / XOR immediate
        .replace(/(^|\s)(and|or|xor)i\s+([^,]+),\s+([^\s]+),\s+(.+)/,
            '$1ldi __r, $5\n' +
            '$2 $3, $4, __r')
        // Logical shift left / right
        .replace(/(^|\s)ls([lr])\s+([^,]+),\s+([^\s]+),\s+(.+)/,
            '$1mov $3, $4\n' +
            'mov __r, $5\n' +
            'eqz __r\n' +
            'rbrts 4\n' +
            'ls$2i $3, $3, 1\n' +
            'dec __r\n' +
            'rjmp -4');

        if (processed !== text) {
          return preProcess(processed);
        } else {
          return text;
        }
      };

      /*
       * Convert lines of assembly into internal code representation.
       */
      var asm2prog = function (lines) {
        if (options.idtSize === undefined) {
          options.idtSize = 8;
        }

        var prog = {
          size: options.size || 4096,
          idt_size: options.idtSize,
          cseg: {},
          dseg: {},
          memory: {},
          labels: [],
          symbols: {},
          // Assembler context:
          memoryCounter: options.idtSize,
          currentSegment: 'cseg'
        };

        // Add built-in symbols:
        prog.symbols['ram_size'] = prog.size;
        prog.symbols['idt_size'] = prog.idt_size;
        prog.symbols['idt_start'] = 0;
        prog.symbols['prog_start'] = prog.idt_size;
        prog.symbols['__r'] = 'r4';
        prog.symbols['active_address'] = function (prog) {
          return prog.memoryCounter;
        };
        prog.symbols['active_segment'] = function (prog) {
          return prog.currentSegment;
        };
        prog.symbols['cseg_size'] = function (prog) {
          return u.len(prog.cseg);
        };
        prog.symbols['dseg_size'] = function (prog) {
          return u.len(prog.dseg);
        };

        // Populate empty interrupt descriptor table
        for (var i = 0; i < prog.idt_size; i++) {
          prog.cseg[i] = ['reti'];
        }

        // Iterate over lines
        for (var i in lines) {

          // Pre-process: trim comments & white space, lower case the text
          var line = lines[i].replace(/;.*/, '').trim().toLowerCase();

          // Skip empty lines
          if (line === '') {
            continue;
          }

          var tokens = tokenize(line, [prog.symbols, prog.labels, prog.memory],
              prog);

          /*
           * Interpret tokens.
           */
          if (tokens[0].match(/^\.(?!byte|word)/)) {
            // DIRECTIVE

            var directive = tokens.shift().replace(/^\./, '');

            switch (directive) {
              case 'dseg':
              case 'cseg':
                prog.currentSegment = directive;
                break;
              case 'org':
                prog.memoryCounter = u.requireUint(tokens[0]);
                break;
              case 'isr':
                prog.cseg[u.requireUint(tokens[0])] = ['jmp', tokens[1]];
                break;
              case 'def':
                prog.symbols[u.requireString(tokens[0])] = u.requireString(
                    tokens[1]);
                break;
              case 'defp':
                if (prog.symbols[u.requireString(tokens[0])] === undefined) {
                  prog.symbols[u.requireString(tokens[0])] = u.requireString(
                      tokens[1]);
                }
                break;
              case 'undef':
                delete prog.symbols[u.requireString(tokens[0])];
                break;
              default:
                throw 'Unrecognised directive "' + directive + '"';
            }

            // Exit directive. This can't be in the switch since 'break'
            // has special meaning within switches.
            if (directive === 'exit') {
              break;
            }

          } else {

            if (prog.currentSegment === 'cseg') {
              // INSTRUCTION

              // Process instruction labels
              if (tokens[0].match(/:$/)) {
                var label = tokens.shift().replace(/:$/, '');

                // If label is a numerical address, then we have already
                // defined the label, so perform a reverse lookup from
                // within the labels table:
                if (!isNaN(new Number(label))) {
                  label = (function (address) {
                    for (var l in prog.labels) {
                      if (prog.labels[l] == label) {
                        return l;
                      }
                    }

                    throw 'Invalid label name "' + label + '"';
                  })(label);
                }

                // Add reference to labels table
                prog.labels[label] = prog.memoryCounter;

                // Continue processing only if there are tokens remaining
                if (tokens.length < 1) {
                  continue;
                }
              }

              // Add instruction to instructions map
              prog.cseg[prog.memoryCounter] = tokens;
              prog.memoryCounter++;
            } else if (prog.currentSegment === 'dseg') {
              // DATA

              // Process instruction labels
              if (tokens[0].match(/:$/)) {
                var label = tokens.shift().replace(/:$/, '');

                // If label is a numerical address, then we have already
                // defined the label, so perform a reverse lookup from
                // within the labels table:
                if (!isNaN(new Number(label))) {
                  label = (function (address) {
                    for (var l in prog.memory) {
                      if (prog.memory[l] == label) {
                        return l;
                      }
                    }

                    throw 'Invalid variable name "' + label + '"';
                  })(label);
                }

                // Add reference to memory table
                prog.memory[label] = prog.memoryCounter;

                // Continue processing only if there are tokens remaining
                if (tokens.length < 1) {
                  continue;
                }
              }

              // Process memory labels
              var size = (function (type) {
                switch (type) {
                  case '.byte':
                    return 0.25;
                  case '.word':
                    return 1;
                  default:
                    throw 'Unrecognised data type "' + type + '"';
                }
              })(tokens[0]);

              var length = u.requireUint(tokens[1]);
              var dstart = new Number(prog.memoryCounter),
                  dend = dstart + Math.ceil(size * length);

              // Populate dseg
              for (var i = dstart; i < dend; i++) {
                prog.dseg[i] = label;

                if (dend - dstart > 1) {
                  prog.dseg[i] += '[' + (i - dstart) + ']';
                }
              }

              // Update memory counter
              prog.memoryCounter = dend;

              // Continue processing only if there are tokens remaining
              if (tokens.length < 1) {
                continue;
              }
            } else {
              throw 'Failed to parse data segment token "' + label + '"';
            }

          }
        }

        // Resolve memory and label names in instructions
        for (var i in prog.cseg) {
          var instruction = prog.cseg[i];

          for (var j in instruction) {
            var token = instruction[j];

            if (prog.memory[token] !== undefined)      // Memory
            {
              instruction[j] = prog.memory[token];
            } else if (prog.labels[token] !== undefined) // Label
            {
              instruction[j] = prog.labels[token];
            }
          }

          // Resolve expressions on label addresses:
          prog.cseg[i] = resolveExpressions(instruction);
        }

        // Write metadata
        prog.cseg_size = u.len(prog.cseg);
        prog.cseg_util = prog.cseg_size / prog.size;
        prog.dseg_size = u.len(prog.dseg);
        prog.dseg_util = prog.dseg_size / prog.size;
        prog.util = prog.cseg_util + prog.dseg_util;

        // Remove run-time information
        delete prog.memoryCounter;
        delete prog.currentSegment;

        return prog;
      };

      /*
       * Generate a program listing
       */
      var prog2list = function (prog) {
        var list = [];

        // Iterate over objects in prog
        for (var i in prog) {
          var s = '.' + i.toUpperCase();    // Begin with property name

          if (typeof prog[i] == 'object') { // Property array value
            var p = [];
            s += '\n';
            for (var j in prog[i]) {        // Property -> Value pair
              if (typeof prog[i][j] === 'function') {
                p.push('        ' + j + ' = [dynamic]');
              } else if (typeof prog[i][j].join === 'function') {
                p.push('        ' + j + ' = ' + prog[i][j].join(' '));
              } else {
                p.push('        ' + j + ' = ' + prog[i][j]);
              }
            }
            s += p.join('\n');
          } else                            // Property value
          {
            s += ' = ' + prog[i];
          }

          list.push(s + '\n');              // Add property string to list
        }
        ;

        return list.join('\n');
      };

      var prog2ram = function (prog) {

        var ram = new Array(prog.size);

        for (var i = 0; i < ram.length; i++) {
          // Lookup memory address in program
          if (prog.cseg[i] !== undefined) {
            try {
              ram[i] = (function (t) {
                switch (t[0]) {
                  case 'nop':
                    return '00000000';
                  case 'halt':
                    return '01000000';
                  case 'jmp':
                    return '02' + u.requireAddress(t[1]);
                  case 'rjmp':
                    return '02' + (u.requireAddress(
                        eval(i + u.requireInt(t[1]))));
                  case 'brts':
                    return '03' + u.requireAddress(t[1]);
                  case 'rbrts':
                    return '03' + (u.requireAddress(
                        eval(i + u.requireInt(t[1]))));
                  case 'seto':
                    return '04' + u.requireByte(t[1]) + u.requireByte(t[2])
                        + u.requireByte(t[3]);
                  case 'tsti':
                    return '05' + u.requireByte(t[1]) + u.requireByte(t[2])
                        + u.requireByte(t[3]);
                  case 'call':
                    return '06' + u.requireAddress(t[1]);
                  case 'rcall':
                    return '06' + (u.requireAddress(
                        eval(i + u.requireInt(t[1]))));
                  case 'ret':
                    return '07000000';
                  case 'reti':
                    return '08000000';
                  case 'sei':
                    return '09000000';
                  case 'cli':
                    return '0A000000';
                  case 'ld':
                    return '0B' + u.requireReg(t[1]) + u.require16Address(t[2]);
                  case 'ldil':
                    return '13' + u.requireReg(t[1]) + u.require16Address(t[2]);
                  case 'ldih':
                    return '14' + u.requireReg(t[1]) + u.require16Address(t[2]);
                  case 'ldr':
                    return '0D' + u.requireReg(t[1]) + '00' + u.requireReg(
                        t[2]);
                  case 'ldd':
                    return '0D' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + u.requireReg(t[3]);
                  case 'ldio':
                    return '12' + u.requireReg(t[1]) + u.requireByte(t[2])
                        + '00';
                  case 'st':
                    return '0C' + u.requireReg(t[2]) + u.require16Address(t[1]); // Note the reverse order!
                  case 'str':
                    return '0E' + u.requireReg(t[1]) + '00' + u.requireReg(
                        t[2]);
                  case 'std':
                    return '0E' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + u.requireReg(t[3]);
                  case 'stio':
                    return '11' + u.requireByte(t[1]) + u.requireReg(t[2])
                        + '00';
                  case 'pshr':
                    return '0F' + u.requireReg(t[1]) + '0000';
                  case 'popr':
                    return '10' + u.requireReg(t[1]) + '0000';
                  case 'and':
                    return '15' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + u.requireReg(t[3]);
                  case 'or':
                    return '16' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + u.requireReg(t[3]);
                  case 'xor':
                    return '17' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + u.requireReg(t[3]);
                  case 'lsri':
                    return '18' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + u.requireByte(t[3]);
                  case 'lsli':
                    return '19' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + u.requireByte(t[3]);
                  case 'equ':
                    return '1A00' + u.requireReg(t[1]) + u.requireReg(t[2]);
                  case 'neq':
                    return '1A01' + u.requireReg(t[1]) + u.requireReg(t[2]);
                  case 'lt':
                    return '1A02' + u.requireReg(t[1]) + u.requireReg(t[2]);
                  case 'lts':
                    return '1B02' + u.requireReg(t[1]) + u.requireReg(t[2]);
                  case 'lte':
                    return '1A03' + u.requireReg(t[1]) + u.requireReg(t[2]);
                  case 'ltes':
                    return '1B03' + u.requireReg(t[1]) + u.requireReg(t[2]);
                  case 'gt':
                    return '1A04' + u.requireReg(t[1]) + u.requireReg(t[2]);
                  case 'gts':
                    return '1B04' + u.requireReg(t[1]) + u.requireReg(t[2]);
                  case 'gte':
                    return '1A05' + u.requireReg(t[1]) + u.requireReg(t[2]);
                  case 'gtes':
                    return '1B05' + u.requireReg(t[1]) + u.requireReg(t[2]);
                  case 'eqz':
                    return '1A06' + u.requireReg(t[1]) + '00';
                  case 'nez':
                    return '1A07' + u.requireReg(t[1]) + '00';
                  case 'mov':
                    return '20' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + '00';
                  case 'clr':
                    return '20' + u.requireReg(t[1]) + '0000';
                  case 'neg':
                    return '22' + u.requireReg(t[1]) + u.requireReg(t[1]) + '00'
                  case 'inc':
                    return '21' + u.requireReg(t[1]) + u.requireReg(t[1])
                        + '00';
                  case 'incs':
                    return '29' + u.requireReg(t[1]) + u.requireReg(t[1])
                        + '00';
                  case 'dec':
                    return '22' + u.requireReg(t[1]) + u.requireReg(t[1])
                        + '00';
                  case 'decs':
                    return '2A' + u.requireReg(t[1]) + u.requireReg(t[1])
                        + '00';
                  case 'add':
                    return '20' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + u.requireReg(t[3]);
                  case 'adds':
                    return '28' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + u.requireReg(t[3]);
                  case 'sub':
                    return '23' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + u.requireReg(t[3]);
                  case 'subs':
                    return '2B' + u.requireReg(t[1]) + u.requireReg(t[2])
                        + u.requireReg(t[3]);

                  default:
                    throw 'Unrecognised mnemonic "' + t[0] + '"';
                }
              })(prog.cseg[i]);
            } catch (err) {
              throw 'Address ' + i + ', Instruction: "' +
              prog.cseg[i].join(' ') + '", Error: ' + err
            }
          } else {
            // Insert blank data
            ram[i] = u.int2hex(0, 8);
          }

          // Annotate the listing if required
          if (options.annotate) {
            ram[i] += ' -- ' + i;
            if (prog.cseg[i]) {
              ram[i] += ' ' + prog.cseg[i].join(' ');
            }
            if (prog.dseg[i]) {
              ram[i] += ' DATA: ' + prog.dseg[i];
            }
          }
        }

        return ram.join('\n');
      };

      try {
        // Pre-process:
        var source = preProcess(data2source(data));

        // First pass:
        var prog = asm2prog(source.split('\n'));

        // Second pass:
        callback(0, {
          prog: prog,
          source: source,
          ram: prog2ram(prog),
          list: prog2list(prog)
        });
      } catch (err) {
        callback(err);
      }
    };

  }, {"./ee4dsa-util": 3}],
  3: [function (require, module, exports) {
    /*
     * util.js - EE4DSA utility functions
     */

    /*
     * Pad the number 'n' to with padding character 'z' to width
     * 'width'. If 'prefix' is true, pad the leading edge.
     */
    var pad = function (n, width, z, prefix) {
      z = z || '0';
      n = n + '';
      // Pop out any html tags when calculating length
      return n.length >= width ? n : prefix ?
          n + new Array(width - n.length + 1).join(z) :
          new Array(width - n.length + 1).join(z) + n;
    };
    module.exports.pad = pad;

    /*
     * Casts a decimal integer to a hexadecimal string.
     */
    var int2hex = function (n, len) {
      len = len || 8; // Default to 32 bits

      var max = (function (len) {
        var s = '0x';
        for (var i = 0; i < len; i++) {
          s += 'f';
        }

        return parseInt(s, 16);
      })(len);

      if (n !== undefined) {
        n = new Number(n);

        if (n < 0) // Twos complement
        {
          n += max + 1;
        }

        if (isNaN(n)) {
          throw 'Failed to convert number!';
        }

        // Pad and truncate string as required
        var string = pad(n.toString(16).toUpperCase(), len);
        var start = string.length > len ? string.length - len : 0;

        return string.substring(start);
      }

      throw 'Failed to convert number "' + n + '"';
    };
    module.exports.int2hex = int2hex;

    var hex2int = function (n) {
      var h = parseInt(n.replace(/^0x/, ''), 16);

      if (isNaN(h)) {
        throw 'Failed to parse integer "' + n + '"';
      }

      return h;
    };
    module.exports.hex2int = hex2int;

    /*
     * Convert a string into an unsigned integer.
     */
    var requireUint = function (word) {
      if (word !== undefined) {
        word = new String(word);

        if (word.match(/^0x[0-9a-f]+/)) {
          return hex2int(word);
        } else if (word.match(/[0-9]+/)) {
          return word;
        }
      }

      throw 'Failed to parse integer "' + word + '"';
    };
    module.exports.requireUint = requireUint;

    /*
     * Convert a string into a signed integer.
     */
    var requireInt = function (word) {
      if (word !== undefined) {
        word = new String(word);

        if (word.match(/^0x[0-9a-f]+/)) {
          return hex2int(word);
        } else if (word.match(/-?[0-9]+/)) {
          return new Number(word);
        }
      }

      throw 'Failed to parse integer "' + word + '"';
    };
    module.exports.requireInt = requireInt;

    var requireString = function (word) {
      if (word === undefined) {
        throw 'Missing required string';
      }

      return new String(word);
    };
    module.exports.requireString = requireString;

    var requireAddress = function (word) {
      return int2hex(requireUint(word), 6);
    };
    module.exports.requireAddress = requireAddress;

    var require16Address = function (word) {
      return int2hex(requireUint(word), 4);
    };
    module.exports.require16Address = require16Address;

    var requireByte = function (word) {
      if (word !== undefined) {
        var i = requireUint(word);

        // Check that number is within bounds of signed or unsigned byte
        if (i >= -129 && i < 256) {
          return int2hex(i, 2);
        }
      }

      throw 'Failed to parse byte "' + word + '"';
    };
    module.exports.requireByte = requireByte;

    var requireReg = function (word) {
      if (word !== undefined) {
        return requireByte(new String(word).replace(/^r/, ''));
      }

      throw 'Failed to parse reg "' + word + '"';
    };
    module.exports.requireReg = requireReg;

    /* Flatten an array */
    var flatten = function (array) {
      var result = [], self = arguments.callee;
      array.forEach(function (item) {
        Array.prototype.push.apply(result,
            Array.isArray(item) ? self(item) : [item]);
      });
      return result;
    };
    module.exports.flatten = flatten;

    /* Count the number of items in object */
    var len = function (obj) {
      counter = 0;

      for (var i in obj) {
        counter++;
      }

      return counter;
    };
    module.exports.len = len;

    /* Convert ratio to percentage */
    var perc = function (n, precision) {
      var n = new Number(n) * 100;

      if (precision !== undefined) {
        n = +n.toFixed(precision);
      }

      return n + '%';
    };
    module.exports.perc = perc;

  }, {}]
}, {}, [1])
