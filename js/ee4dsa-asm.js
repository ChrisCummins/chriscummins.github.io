/*
 * asm.js - EE4DSA assembly code implementation. Objects used to represent
 *          and display assembly instructions.
 */

// Labels

var _labelCounter = 0;   // Used for automatic label naming
var _routineCounter = 0; // Used for automatic interrupt label naming
var _vectorCounter = 0;  // Used for automatic interrupt label naming

// Reset the automatic labelling counters
var resetLabelCounters = function() {
  _labelCounter = 0;
  _routineCounter = 0;
  _vectorCounter = 0;
};

/*
 * An assembly instruction label
 */
var Label = function(name) {
  this.name = name ? name : 'label' + _labelCounter++;

  this.html = function() {
    return '<span class="asm-label">' + this.name + '</span>:';
  };
};

/*
 * An assembly routine label
 */
var RoutineLabel = function(name) {
  this.name = name ? name : 'subroutine' + _routineCounter++;

  this.html = function() {
    return ' \n<span class="asm-label">' + this.name + '</span>:';
  };
};

/*
 * An interrupt handler label
 */
var VectorLabel = function(name) {
  this.name = name ? name : 'irq' + _vectorCounter++;

  this.html = function() {
    return ' \n<span class="asm-label">' + this.name + '</span>:';
  };
};

// Components

/*
 * An empty line
 */
var BlankLine = function() {
  this.html = function() {
    return ' ';
  };
};

/*
 * A full-line comment
 */
var Comment = function(text) {
  this.html = function() {
    return '<span class="comment">;; ' + text + '</span>';
  };
};

/*
 * A program directive
 */
var Directive = function(name) {
  this.html = function() {
    return '<span class="directive">.' + name + '</span>';
  };
};

var Org = function(address) {
  this.html = function() {
    return new Directive('org <span class="value">' +
                         int2hex32(address) + '</span>').html();
  };
};

/*
 * An instruction. Accepts a map of options with the following values:
 *
 *   address:     The absolute address of the instruction as a decimal integer
 *   mnemonic:    The assembler mnemonic of the instruction
 *   args:        (optional) An array of instruction arguments
 *   jumpAddress: (optional) The destination address of a jump or branch instruction
 *   comment:     (optional) An inline comment string
 *   isIdtVector  (optional) Whether the instruction is an interrupt vector
 *   label:       (optional) A label object for the instruction
 */
var Instruction = function(ops) {
  'use strict';

  this.address = ops.address;
  this.addressHex32 = int2hex32(this.address);
  this.jumpAddress = ops.jumpAddress;
  this.jumpAddressHex32 = int2hex32(this.jumpAddress);
  this.mnemonic = ops.mnemonic.toLowerCase();
  this.args = ops.args || [];
  this.comment = ops.comment || '';
  this.isIdtVector = ops.isIdtVector || false;
  this._label = ops.label;

  /*
   * Return a label for the instruction. If 'name' is given, then
   * return a label with that name, else return an auto-generated
   * label of type 'type' (valid types: 'routine', 'interrupt'). If
   * 'type' isn't given, generate default label name.
   */
  this.label = function(type, name) {
    if (this._label === undefined) { // Internal label generation
      if (name)
        this._label = new Label(name);
      else if (type == 'routine')
        this._label = new RoutineLabel();
      else if (type == 'interrupt')
        this._label = new VectorLabel();
      else
        this._label = new Label();
    }

    return this._label;
  };

  /*
   * Returns an HTML representation of an instruction. Accepts an
   * argument 'ram' which represents the RAM dump within which this
   * instruction resides. This is used to generate cross-referenced
   * labels.
   */
  this.html = function(ram) {
    ram = ram || [];

    // Generate the HTML for the label (if there is one)
    var labelHTML = this._label ? this.label().html() + '\n' : '';

    var string = '\t<span class="mnemonic">' + this.mnemonic + '</span>\t', s;

    if (this.jumpAddress) {
      // Branch instruction
      if (this.isIdtVector)             // Interrupt
        s = ram[this.jumpAddress].label('interrupt').name;
      else if (this.mnemonic == 'call') // Subroutine
        s = ram[this.jumpAddress].label('routine').name;
      else                              // Jump
        s = ram[this.jumpAddress].label().name;

      string += '<span class="asm-label">' + s + '</span>';
    } else { // Regular instruction
      this.args.forEach(function(arg) {
        if (arg.match(/^((0x[0-9a-f]+)|([0-9]+))$/i))
          string += '<span class="value">' + arg + '</span>, ';
        else
          string += '<span class="register">' + arg + '</string>, ';
      });
    }

    return labelHTML + string.replace(/, $/, '');
  };
};
