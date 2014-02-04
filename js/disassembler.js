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

    this.binary = instruction;
    this.address = address;
    this.next = [this.address + 1];

    switch (parseInt(bytes[0], 16)) {
    case 0:
      this.mnemonic = 'iuc';
      this.instruction = this.mnemonic.toUpperCase();
      this.desc = 'No operation';
      break;
    case 1:
      this.mnemonic = 'huc';
      this.instruction = this.mnemonic.toUpperCase();
      this.desc = 'Terminate';
      break;
    case 2:
      var address = bytes[1] + bytes[2] + bytes[3];

      this.mnemonic = 'buc';
      this.instruction = this.mnemonic.toUpperCase() + ' ' + address;
      this.desc = 'Jump to ' + address;
      this.next = [parseInt(address, 16)];
      break;
    case 3:
      var address = bytes[1] + bytes[2] + bytes[3];

      this.mnemonic = 'bic';
      this.instruction = this.mnemonic.toUpperCase() + ' ' + address;
      this.desc = 'Jump to ' + address + ' if condition flag is set';
      this.next.push(parseInt(address, 16));
      break;
    case 4:
      this.mnemonic = 'seto 0x' + bytes[1] + ', 0x' +
        bytes[2] + ', 0x' + bytes[3];
      this.instruction = 'SETO' + bytes[1] + bytes[2] + bytes[3];
      this.desc = 'Set outputs ' + bytes[1] + ' AND ' + bytes[2] + ' XOR ' + bytes[3];
      break;
    case 5:
      this.mnemonic = 'tsti 0x' + bytes[1] + ', 0x' +
        bytes[2] + ', 0x' + bytes[3];
      this.instruction = 'TSTI ' + bytes[1] + bytes[2] + bytes[3];
      this.desc = 'Test input port ' + parseInt(bytes[1], 16) + ' AND ' +
        bytes[2] + ' XOR ' + bytes[3];
      break;
    default:
      throw "Invalid opcode '" + bytes[0] + "'";
    };

    this._label = null;
    this.getLabel = function() {
      if (this._label === null)
        this._label = new Label();

      return this._label;
    };

    this.hasLabel = function() {
      return this._label !== null;
    };

    this.toString = function(instructions) {
      var string = '';

      if (this.hasLabel())
        string += this.getLabel().toString() + '\n';

      string += '        ';

      // Generate labels
      if (this.next[0] !== this.address + 1)
        string += this.mnemonic + ' ' + instructions[this.next[0]].getLabel().name;
      else if (this.next[1] !== undefined)
        string += this.mnemonic + ' ' + instructions[this.next[1]].getLabel().name;
      else
        string += this.mnemonic;

      return string;
    };
  };

  var Comment = function(text) {
    this.toString = function() {
      return ';; ' + text;
    };
  };

  var BlankLine = function() {
    this.toString = function() {
      return '';
    };
  };

  var Label = function(name) {
    this.name = name !== undefined ? name : getLabelName();

    this.toString = function() {
      return this.name + ':';
    };
  };

  var code = $('#code');
  var errors = $('#errors');
  var output = $('#output');
  var assembly = $('#assembly');

  // Decode an array of strings, one instruction per string
  var decode = function(text) {
    var instructions = [];

    try { // Parse instruction
      var address = 0;

      for (var i = 0; i < text.length; i++) {
        var string = text[i].trim()

        if (string.length)
          instructions.push(new Instruction(string, address++));
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
      else
        return "i" + i + "=>operation: " + instruction.instruction + "\n";
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

    var definitions = "st=>start: Start\ne=>end: End\n", links = "";

    if (instructions.length) {
      links += "st->i0\n";
      links += "i" + (instructions.length - 1) + "->e\n";
    }

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

  var _labelCounter = 0;
  var getLabelName = function() {
    return 'label' + _labelCounter++;
  };

  var instructionsToProgram = function(instructions) {
    var prog = [new Comment('Generated assembly, see:'),
                new Comment('    http://chriscummins.cc/disassembler'),
                new Comment(''),
                new BlankLine()];

    instructions[0]._label = new Label('start');

    // Generate labels
    // TODO:

    instructions.forEach(function(e) {
      prog.push(e);
    });

    // Generate label cross references
    prog.forEach(function(e) {
      e.toString(instructions);
    });

    prog.push(new BlankLine());
    prog.push(new Comment('End of program code'))

    // Generate textual representation
    var string = '';
    prog.forEach(function(e) {
      string += e.toString(instructions) + '\n';
    });

    return string;
  };

  // Display an array of instructions
  var show = function(instructions) {
    instructions.forEach(function(e) {
      addInstruction(e);
    });

    assembly.html(instructionsToProgram(instructions));

    if (instructions.length)
      $('#code-output').show();
    else
      $('#code-output').hide();

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
    assembly.html('');
    _labelCounter = 0;
  };

  var addInstruction = function(instruction) {
    output.append("<tr><td class=\"address\">" +
                  pad(instruction.address.toString(16), 8).toUpperCase() +
                  "</td><td class=\"opcode\">" + instruction.binary + "</td>" +
                  "<td class=\"instruction\">" + instruction.instruction + "</td>" +
                  "<td class=\"description\">" + instruction.desc + "</td>" +
                  "</tr>");
  };

  // Update as the user types
  code.bind('input propertychange', function() {
    clearErrors();
    clearInstructions();
    decode(code.val().split("\n"));
  });

}).call(Disassembler);
