var Disassembler = Disassembler || {};

(function() {
  'use strict';

  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  // An instruction
  var Instruction = function(instruction, address) {

    var toBytes = function(number) {
      var p = [];

      for (var i = Math.floor(number.length / 2); i-->0;) {
        p[i] = number.slice(i * 2, (i + 1) * 2);
      }

      return p;
    }

    if (instruction.length != 8 || !instruction.match(/[0-9a-fA-F]{8}/)) {
      throw "Invalid instruction '" + instruction + "'";
    }

    var bytes = toBytes(instruction);

    this.opcode = instruction;
    this.address = pad(address.toString(16), 8).toUpperCase();

    switch (parseInt(bytes[0], 16)) {
    case 0:
      this.instruction = 'IUC';
      this.desc = 'Increment unconditionally';
      break;
    case 1:
      this.instruction = 'HUC';
      this.desc = 'Halt unconditionally';
      break;
    case 2:
      var address = + bytes[1] + bytes[2] + bytes[3];
      this.instruction = 'BUC  ' + address;
      this.desc = 'Jump to address ' + address;
      break;
    case 3:
      var address = + bytes[1] + bytes[2] + bytes[3];
      this.instruction = 'BIC  ' + address;
      this.desc = 'Branch conditionally to ' + address;
      break;
    case 4:
      this.instruction = 'SET0 ' + bytes[1] + ' ' + bytes[2] + ' ' + bytes[3];
      this.desc = 'Set outputs ' + bytes[1] + ' AND ' + bytes[2] + ' XOR ' + bytes[3];
      break;
    case 5:
      this.instruction = 'TSTI ' + bytes[1] + ' ' + bytes[2] + ' ' + bytes[3];
      this.desc = 'Test inputs ' + bytes[1] + ' AND ' + bytes[2] + ' XOR ' + bytes[3];
      break;
    default:
      throw "Invalid opcode '" + op.toString(2) + "'";
    };
  };

  var code = $('#code');
  var errors = $('#errors');
  var output = $('#output');

  // Decode an array of strings, one instruction per string
  var decode = function(text) {
    var instructions = [];

    try { // Parse instruction

      for (var i = 0; i < text.length; i++) {
        var string = text[i].trim()

        if (string.length)
          instructions.push(new Instruction(string, i));
      }

    } catch (err) {
      addError("<strong>At line " + i + ":</strong> " + err);
    }

    show(instructions);
  }

  // Display an array of instructions
  var show = function(instructions) {
    instructions.forEach(function(e) {
      addInstruction(e);
    });

    if (instructions.length)
      $('#labels').show();
    else
      $('#labels').hide();
  };

  var clearErrors = function() {
    errors.html('');
  };

  var addError = function(msg) {
    errors.append("<div class=\"alert alert-error\">" + msg +
                  "<a class=\"close\" data-dismiss=\"alert\" " +
                  "href=\"#\">&times;</a></div>");
  };

  var clearInstructions = function() {
    output.html('');
  };

  var addInstruction = function(instruction) {
    output.append("<tr><td class=\"address\">" + instruction.address + "</td>" +
                  "<td class=\"opcode\">" + instruction.opcode + "</td>" +
                  "<td class=\"instruction\">" + instruction.instruction + "</td>" +
                  "<td class=\"description\">" + instruction.desc + "</td>" +
                  "</tr>");
  }

  // Update as the user types
  code.bind('input propertychange', function() {
    clearErrors();
    clearInstructions();
    decode(code.val().split("\n"));
  });

}).call(Disassembler);
