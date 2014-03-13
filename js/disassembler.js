var Disassembler = Disassembler || {};

(function() {
  'use strict';

  // Pad the number 'n' to with padding character 'z' to width 'width'.
  function pad(n, width, z, tail) {
    z = z || '0';
    n = n + '';
    // Pop out any html tags when calculating length
    var length = n.replace(/<\/?[a-zA-Z ="]+>/g, '').length;

    return length >= width ? n : tail ?
      n + new Array(width - length + 1).join(z) :
      new Array(width - length + 1).join(z) + n;
  }

  // An instruction
  var Instruction = function(instruction, address, comment) {

    // Sanity check for correct instruction length
    if (instruction.length != 8 || !instruction.match(/[0-9a-fA-F]{8}/)) {
      throw "Invalid instruction '" + instruction + "'";
    }

    // Convert a hex encoded byte to a register name
    var hex2RegName = function(hex) {
      var id = parseInt(hex, 16)

      switch (id) {
      case 0:
        return 'NULL';
      case 1:
        return 'SP';
      case 2:
        return 'SREG';
      default:
        return 'r' + id;
      }
    };

    // Convenience variables
    var bytes = function(number) {
      var p = [];

      for (var i = Math.floor(number.length / 2); i-->0;)
        p[i] = number.slice(i * 2, (i + 1) * 2);

      return p;
    }(instruction);

    this.address = address;
    this.addressHex = pad(address.toString(16), 8).toUpperCase();

    var opAddress = bytes[1] + bytes[2] + bytes[3];
    var jumpAddress = parseInt(opAddress, 16) - idtLength;
    var regA = hex2RegName(bytes[1]);
    var regB = hex2RegName(bytes[2]);
    var regC = hex2RegName(bytes[3]);
    var intByte0 = parseInt(bytes[0], 16);
    var intByte1 = parseInt(bytes[1], 16);
    var intByte2 = parseInt(bytes[2], 16);
    var intByte3 = parseInt(bytes[2], 16);
    var value = bytes[2] + bytes[3];
    var paddedAddress = '00' + value;

    // Decode instruction opcode
    switch (intByte0) {
    case 0:
      this.ops = ['nop'];
      break;
    case 1:
      this.ops = ['halt'];
      break;
    case 2:
      this.ops = ['jmp', '0x' + opAddress];
      this.desc = 'Jump to 0x' + opAddress;
      this.jump = jumpAddress;
      break;
    case 3:
      this.ops = ['brts', '0x' + opAddress];
      this.desc = 'Branch to 0x' + opAddress + ' if SR[T] set';
      this.jump = jumpAddress;
      break;
    case 4:
      this.ops = ['seto', '0x' + bytes[1], '0x' + bytes[2], '0x' + bytes[3]];
      this.desc = 'OUT[' + intByte1 + '] = (OUT[' + intByte1 + '] & 0x' +
        bytes[2] + ') ^ 0x' + bytes[3];
      break;
    case 5:
      this.ops = ['tsti', '0x' + bytes[1], '0x' + bytes[2], '0x' + bytes[3]];
      this.desc = 'SR[T] = (OUT[' + intByte1 + '] & 0x' + bytes[2] + ') ^ 0x' + bytes[3];
      break;
    case 6:
      this.ops = ['call'];
      this.desc = 'Call 0x' + opAddress;
      this.jump = jumpAddress;
      break;
    case 7:
      this.ops = ['ret'];
      break;
    case 8:
      this.ops = ['reti'];
      break;
    case 9:
      this.ops = ['sei'];
      this.desc = 'Global interrupt enable';
      break;
    case 10:
      this.ops = ['cli'];
      this.desc = 'Global interrupt disable';
      break;
    case 11:
      this.ops = ['mtr', regA, '0x' + paddedAddress];
      this.desc = regA + ' = RAM[0x' + paddedAddress + ']';
      break;
    case 12:
      this.ops = ['rtm', regA, '0x' + paddedAddress];
      this.desc = 'RAM[0x' + paddedAddress + '] = ' + regA;
      break;
    case 13:
      this.ops = ['imtr', regA, regB, regC];
      this.desc = regA + ' = RAM[' + regB + ' + ' + regC + ']';
      break
    case 14:
      this.ops = ['rtim', regA, regB, regC];
      this.desc = 'RAM[' + regB + ' + '+ regC + '] = ' + regA;
      break;
    case 15:
      this.ops = ['pshr', regA];
      this.desc = 'Push register ' + regA + ' to stack';
      break;
    case 16:
      this.ops = ['popr', regA];
      this.desc = 'Pop stack to register ' + regA;
      break;
    case 17:
      this.ops = ['rtio', '0x' + bytes[1], regB];
      this.desc = 'OUT[' + intByte1 + '] = ' + regB;
      break;
    case 18:
      this.ops = ['iotr', regA, '0x' + bytes[2]];
      this.desc = regA + ' = OUT[' + intByte2 + ']';
      break;
    case 19:
      this.ops = ['ldl', regA, '0x' + value];
      this.desc = regA + '(15 downto 0) = 0x' + value;
      break;
    case 20:
      this.ops = ['ldu', regA, '0x' + value];
      this.desc = regB + '(31 downto 16) = 0x' + value;
      break;
    case 21:
      this.ops = ['andr', regA, regB, regC];
      this.desc = regA + ' = ' + regB + ' & ' + regC;
      break;
    case 22:
      this.ops = ['orr', regA, regB, regC];
      this.desc = regA + ' = ' + regB + ' | ' + regC;
      break;
    case 23:
      this.ops = ['xorr', regA, regB, regC];
      this.desc = regA + ' = ' + regB + ' ^ ' + regC;
      break;
    case 24:
      this.ops = ['srlr', regA, regB, regC];
      this.desc = regA + ' = ' + regB + ' >> ' + regC;
      break;
    case 25:
      this.ops = ['sllr', regA, regB, regC];
      this.desc = regA + ' = ' + regB + ' << ' + regC;
      break;
    case 26:
      this.ops = ['cmpu', regA, regB, regC];
      this.desc = '' // TODO:
      break;
    case 27:
      this.ops = ['cmps', regA, regB, regC];
      this.desc = '' // TODO:
      break;
    case 32:
    case 33:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
      this.ops = ['aluu', regA, regB, regC];
      this.desc = '' // TODO:
      break;
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
      this.ops = ['alus', regA, regB, regC];
      this.desc = '' // TODO:
      break;
    default:
      throw "Invalid opcode 0x'" + bytes[0] + "'";
    };

    // Set the inline instruction comment
    if (comment !== undefined)
      this.comment = comment;
    else if (this.desc !== undefined)
      this.comment = this.desc;
    else
      this.comment = '';

    // Return a label for the given address
    this.getLabel = function(type) {
      if (this.label === undefined) {
        if (type == 'routine')
          this.label = new RoutineLabel();
        else if (type == 'interrupt')
          this.label = new VectorLabel();
        else
          this.label = new Label();
      }

      return this.label;
    };

    // Return a string representation of an instruction
    this.toString = function(instructions) {
      var label = this.label ? this.getLabel().toString() + '\n' : '';
      var string = '        ';

      if (this.jump) {
        string += '<span class="mnemonic">' + this.ops[0] + '\t';

        if (this.address < idtLength) // Interrupt vector
          string += instructions[this.jump].getLabel('interrupt').name;
        else if (this.ops[0] == 'call')
          string += instructions[this.jump].getLabel('routine').name;
        else // Jump instruction
          string += instructions[this.jump].getLabel().name;

        string += '</span>';

      } else if (this.jump) { // Jump or branch instruction
        string += '<span class="mnemonic">' + this.ops[0] + '</span>' +
          '\t' + instructions[this.jump].getLabel().name;
      } else {
        string += '<span class="mnemonic">' + this.ops[0] +
          '</span>\t<span class="value">' +
          this.ops.slice(1).join('</span>, <span class="value">')
          + '</span>';
      }

      return label + string;
    };
  };

  var Directive = function(name) {
    this.comment = '';
    this.toString = function() {
      return '<span class="directive">.' + name + '</span>';
    };
  };

  var Comment = function(text) {
    this.comment = '';
    this.toString = function() {
      return '<span class="comment">;; ' + text + '</span>';
    };
  };

  var BlankLine = function() {
    this.comment = '';
    this.toString = function() {
      return ' ';
    };
  };

  var _labelCounter = 0; // Used for automatic label naming
  var _routineCounter = 0; // Used for automatic interrupt label naming
  var _vectorCounter = 0; // Used for automatic interrupt label naming

  var Label = function(name) {
    this.name = name ? name : 'label' + _labelCounter++;

    this.toString = function() {
      return '<span class="asm-label">' + this.name + '</span>:';
    };
  };

  var RoutineLabel = function(name) {
    this.name = name ? name : 'subroutine' + _routineCounter++;

    this.toString = function() {
      return ' \n<span class="asm-label">' + this.name + '</span>:';
    };
  };

  var VectorLabel = function(name) {
    this.name = name ? name : 'irq' + _vectorCounter++;

    this.toString = function() {
      return ' \n<span class="asm-label">' + this.name + '</span>:';
    };
  };

  var $code = $('#code');
  var $errors = $('#errors');
  var $output = $('#output');

  var idtLength = 8; // Interrupt Descriptor Table length (in words)

  // Decode an array of strings, one instruction per string
  var decode = function(text) {

    var instructions = [], idt = [], address = 0, string = '', i = 0;
    var lastInstruction = (function(text) {
      for (i = text.length - 1; i >= 0; i--)
        if (parseInt(text[i]))
          return i;
    })(text);

    try { // Parse instructions
      for (i = 0; i < lastInstruction; i++) {
        string = text[i].trim();

        if (string.length) {
          if (i < idtLength) { // Interrupt descriptor
            idt.push(new Instruction(string, address++,
                                     'Interrupt vector ' + i));
          } else { // Instruction
            instructions.push(new Instruction(string, address++));
          }
        }
      }
    } catch (err) { // Stop decoding on first error
      addError("<strong>At line " + i + ":</strong> " + err);
    }

    return {
      instructions: instructions,
      idt: idt
    };
  }

  var showAssembly = function(data) {
    var instructions = data.instructions;
    var idt = data.idt;
    var prog = [new Comment('Generated assembly, see:'),
                new Comment('    http://chriscummins.cc/disassembler'),
                new Comment(''),
                new BlankLine()];
    var string = '', currentAddress = 0;

    var paddedAddress = function(address) {
      return pad(address.toString(16).toUpperCase(), 8);
    };

    prog.push(new Directive('cseg'));
    prog.push(new Directive('org 0x' + paddedAddress(0)));

    if (idt.length) { // Show interrupt table label
      prog.push(new BlankLine());

      idt[0].label = new Label('interrupt_vectors');
      idt.forEach(function(e) {
        prog.push(e);
        currentAddress++;
      });

      prog.push(new BlankLine());
      prog.push(new Directive('org 0x' + paddedAddress(currentAddress)));
    }

    prog.push(new BlankLine());

    if (instructions.length) // Set special "start" label
      instructions[0].label = new Label('_main');

    instructions.forEach(function(e) {
      prog.push(e);
    });

    // Generate label cross references
    prog.forEach(function(e) {
      try {
        e.toString(instructions);
      } catch (err) {
        addError("<strong>At address " + e.addressHex +
                 ":</strong> Branch address out of bounds!")
      }
    });

    prog.push(new BlankLine());
    prog.push(new Comment('End of program code'))

    // Display table
    currentAddress = -1;
    prog.forEach(function(e) {
      // Skip NOP rows
      if (!e.ops || e.ops[0] !== 'nop') {

        // Increment address for proper instructions
        if (e.ops)
          currentAddress++;

        // Insert org directives to show jumps in memory
        if (e.address && e.address !== currentAddress) {
          console.log(currentAddress, e.address);
          currentAddress = e.address;

          addInstruction(new BlankLine(), instructions);
          addInstruction(new Directive('org 0x' + paddedAddress(currentAddress)),
                         instructions);
        }

        // Display row
        addInstruction(e, instructions);
      }
    });
  };

  // Display an array of instructions
  var show = function(data) {

    var instructions = data.instructions;
    var idt = data.idt;

    showAssembly(data);

    if (idt.length || instructions.length)
      $('#code-output').show();
    else
      $('#code-output').hide();
  };

  var addError = function(msg) {
    $errors.append("<div class=\"alert alert-error\">" + msg +
                   "<a class=\"close\" data-dismiss=\"alert\" " +
                   "href=\"#\">&times;</a></div>");
  };

  var addWarning = function(msg) {
    $errors.append("<div class=\"alert alert-warning\">" + msg +
                   "<a class=\"close\" data-dismiss=\"alert\" " +
                   "href=\"#\">&times;</a></div>");
  };

  var addInstruction = function(instruction, instructions) {

    var addRow = function(address, comment, instruction, id, target) {
      var html = '<tr';

      if (id && id !== '')
        html += ' id="' + id + '"';

      if (target && target !== '')
        html += ' data-target="' + target + '"';

      html += '><td class="address"><pre>';

      if (address && address !== '')
        html += address;

      html += '</pre></td><td class="instruction"><pre>' +
        instruction + '</pre></td><td class="comment">';

      if (comment)
        html += '<pre><span class="comment">; ' + comment + '</span></pre>';

      html += '</td></tr>';

      $output.append(html);
    };

    var addInstructionRow = function(address, text, caption,
                                     instruction, instructions) {
      if (!instruction.ops) // Non-instructions: comments, directives etc.
        addRow(address, instruction.comment, text, caption);
      else if (instruction.jump) // Jump & branch instructions
        addRow(address, instruction.comment, text, caption, '',
               instructions[instruction.jump].addressHex);
      else // Standard instruction
        addRow(address, instruction.comment, text, caption);
    };

    var address = instruction.address === undefined ?
      '' : instruction.addressHex;
    var caption = instruction.desc === undefined ? '' : instruction.desc;
    var lines = instruction.toString(instructions).split('\n');

    if (lines.length > 1) { // Instruction contains label
      for (var i = 0; i < lines.length - 2; i++)
        addRow('', '', lines[i]);
      addRow('', '', lines[lines.length - 2], '', instruction.addressHex);
      addInstructionRow(address, lines[lines.length - 1], caption, instruction, instructions);
    } else {
      addInstructionRow(address, lines[0], caption, instruction, instructions);
    }
  };

  var refresh = function() { // Refresh display
    $errors.html('');
    $output.html('');
    _labelCounter = 0;
    _routineCounter = 0;
    _vectorCounter = 0;

    show(decode($code.val().split("\n")));

    $('#output tr').click(function() {
      var target = $(this).attr('data-target');

      if (target) {
        $('tr').removeClass('highlight');
        $('#' + target).addClass('highlight');
        window.location.hash = target;
      }
    });
  };

  // Update as the user types
  $code.bind('input propertychange', function() {
    refresh();
  });

  $('#idt-enable').change(function() {
    idtLength = parseInt($('#idt-enable option:selected').val());
    refresh();
  });

}).call(Disassembler);
