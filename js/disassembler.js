var Disassembler = Disassembler || {};

(function() {
  'use strict';

  var diagram;

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
    this.next = [parseInt(this.address, 16) + 1];

    switch (parseInt(bytes[0], 16)) {
    case 0:
      this.instruction = 'IUC';
      this.desc = 'No operation';
      break;
    case 1:
      this.instruction = 'HUC';
      this.desc = 'Terminate';
      break;
    case 2:
      var address = + bytes[1] + bytes[2] + bytes[3];
      this.instruction = 'BUC  ' + address;
      this.desc = 'Jump to ' + address;
      this.next = [parseInt(address, 16)];
      break;
    case 3:
      var address = + bytes[1] + bytes[2] + bytes[3];
      this.instruction = 'BIC  ' + address;
      this.desc = 'Jump to ' + address + ' if condition flag is set';
      this.next.push(parseInt(address, 16));
      break;
    case 4:
      this.instruction = 'SET0 ' + bytes[1] + bytes[2] + bytes[3];
      this.desc = 'Set outputs ' + bytes[1] + ' AND ' + bytes[2] + ' XOR ' + bytes[3];
      break;
    case 5:
      this.instruction = 'TSTI ' + bytes[1] + bytes[2] + bytes[3];
      this.desc = 'Test inputs ' + bytes[1] + ' AND ' + bytes[2] + ' XOR ' + bytes[3];
      break;
    default:
      throw "Invalid opcode '" + bytes[0] + "'";
    };
  };

  var code = $('#code');
  var errors = $('#errors');
  var output = $('#output');

  // Decode an array of strings, one instruction per string
  var decode = function(text) {
    var instructions = [];

    try { // Parse instruction
      var count = 0;

      for (var i = 0; i < text.length; i++) {
        var string = text[i].trim()

        if (string.length)
          instructions.push(new Instruction(string, count++));
      }

    } catch (err) {
      addError("<strong>At line " + i + ":</strong> " + err);
    }

    show(instructions);
  }

  var instructionsToChart = function(instructions) {
    var instructionDefinition = function(instruction, i) {
      if (instruction.next[1] !== undefined)
        return "i" + i + "=>condition: " + instruction.instruction + "\n";
      else {
        if (i === 0)
          return "i" + i + "=>start: " + instruction.instruction + "\n";
        else if (i === instructions.length - 1)
          return "i" + i + "=>end: " + instruction.instruction + "\n";
        else
          return "i" + i + "=>operation: " + instruction.instruction + "\n";
      }
    };

    var instructionLinks = function(instruction, i) {
      if (instruction.next[1] !== undefined) {
        var links = "";

        if (instruction.next[0] !== -1)
          links = "i" + i + "(no)->i" + instruction.next[0] + "\n";
        if (instruction.next[1] !== -1)
          links += "i" + i + "(yes, right)->i" + instruction.next[1] + "\n";

        return links
      } else {
        if (instruction.next[0] !== -1)
          return "i" + i + "->i" + instruction.next[0] + "\n";
        else
          return "";
      }
    }

    var definitions = "", links = "";

    for (var i = 0; i < instructions.length; i++) {
      if (instructions[i].next[0] >= instructions.length)
        instructions[i].next[0] = -1;

      if (instructions[i].next[1] >= instructions.length)
        instructions[i].next[1] = -1;

      definitions += instructionDefinition(instructions[i], i);
      links += instructionLinks(instructions[i], i);
    }

    return definitions + links;
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

    // Draw flowchart
    if (diagram)
      diagram.clean();

    diagram = flowchart.parse(instructionsToChart(instructions));
    diagram.drawSVG('diagram');
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
