/*
 * disassembler.js - Utility for decoding words into assembly
 *                   instructions.
 */

/*
 * Decodes a word into an assembly instruction. Accepts three arguments:
 *
 *    word:    The word value of the instruction, encoded as an 4 byte
 *             hexadecimal value.
 *    address: The absolute address of the instruction as a decimal integer.
 *    idtSize: (optional) The size of the interrupt vector table.
 *    comment: (optional) A special comment for the instruction.
 */
var word2instruction = function(word, address, idtSize, comment) {
  'use strict';

  idtSize = idtSize || 0

  // Sanity check for correct word length
  if (word.length != 8 || !word.match(/[0-9a-fA-F]{8}/)) {
    throw "Invalid instruction '" + word + "'";
  }

  // Our instruction options
  var ops = {};

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

  // The raw bytes of the word
  var bytes = function(number) {
    var p = [];

    for (var i = Math.floor(number.length / 2); i-->0;)
      p[i] = number.slice(i * 2, (i + 1) * 2);

    return p;
  }(word);

  // Convenience variables.
  var regA = hex2RegName(bytes[1]);
  var regB = hex2RegName(bytes[2]);
  var regC = hex2RegName(bytes[3]);
  var intByte0 = parseInt(bytes[0], 16);
  var intByte1 = parseInt(bytes[1], 16);
  var intByte2 = parseInt(bytes[2], 16);
  var intByte3 = parseInt(bytes[2], 16);
  var opAddress = bytes[1] + bytes[2] + bytes[3];
  var jumpAddress = parseInt(opAddress, 16) - idtSize;
  var value = bytes[2] + bytes[3];
  var paddedAddress = '0000' + value;

  // Decode instruction opcode
  switch (intByte0) {
  case 0:
    var operations = ['nop'];
    break;
  case 1:
    var operations = ['halt'];
    break;
  case 2:
    var operations = ['jmp', '0x' + opAddress];
    ops.comment = 'Jump to 0x' + opAddress;
    ops.jumpAddress = jumpAddress;
    break;
  case 3:
    var operations = ['brts', '0x' + opAddress];
    ops.comment = 'Branch to 0x' + opAddress + ' if SR[T] set';
    ops.jumpAddress = jumpAddress;
    break;
  case 4:
    var operations = ['seto', '0x' + bytes[1], '0x' + bytes[2], '0x' + bytes[3]];
    ops.comment = 'OUT[' + intByte1 + '] = (OUT[' + intByte1 + '] & 0x' +
      bytes[2] + ') ^ 0x' + bytes[3];
    break;
  case 5:
    var operations = ['tsti', '0x' + bytes[1], '0x' + bytes[2], '0x' + bytes[3]];
    ops.comment = 'SR[T] = (OUT[' + intByte1 + '] & 0x' + bytes[2] + ') ^ 0x' + bytes[3];
    break;
  case 6:
    var operations = ['call'];
    ops.comment = 'Call 0x' + opAddress;
    ops.jumpAddress = jumpAddress;
    break;
  case 7:
    var operations = ['ret'];
    break;
  case 8:
    var operations = ['reti'];
    break;
  case 9:
    var operations = ['sei'];
    ops.comment = 'Global interrupt enable';
    break;
  case 10:
    var operations = ['cli'];
    ops.comment = 'Global interrupt disable';
    break;
  case 11:
    var operations = ['mtr', regA, '0x' + paddedAddress];
    ops.comment = regA + ' = RAM[0x' + paddedAddress + ']';
    break;
  case 12:
    var operations = ['rtm', regA, '0x' + paddedAddress];
    ops.comment = 'RAM[0x' + paddedAddress + '] = ' + regA;
    break;
  case 13:
    var operations = ['imtr', regA, regB, regC];
    ops.comment = regA + ' = RAM[' + regB + ' + ' + regC + ']';
    break
  case 14:
    var operations = ['rtim', regA, regB, regC];
    ops.comment = 'RAM[' + regB + ' + '+ regC + '] = ' + regA;
    break;
  case 15:
    var operations = ['pshr', regA];
    ops.comment = 'Push register ' + regA + ' to stack';
    break;
  case 16:
    var operations = ['popr', regA];
    ops.comment = 'Pop stack to register ' + regA;
    break;
  case 17:
    var operations = ['rtio', '0x' + bytes[1], regB];
    ops.comment = 'OUT[' + intByte1 + '] = ' + regB;
    break;
  case 18:
    var operations = ['iotr', regA, '0x' + bytes[2]];
    ops.comment = regA + ' = OUT[' + intByte2 + ']';
    break;
  case 19:
    var operations = ['ldl', regA, '0x' + value];
    ops.comment = regA + '(15 downto 0) = 0x' + value;
    break;
  case 20:
    var operations = ['ldu', regA, '0x' + value];
    ops.comment = regB + '(31 downto 16) = 0x' + value;
    break;
  case 21:
    var operations = ['andr', regA, regB, regC];
    ops.comment = regA + ' = ' + regB + ' & ' + regC;
    break;
  case 22:
    var operations = ['orr', regA, regB, regC];
    ops.comment = regA + ' = ' + regB + ' | ' + regC;
    break;
  case 23:
    var operations = ['xorr', regA, regB, regC];
    ops.comment = regA + ' = ' + regB + ' ^ ' + regC;
    break;
  case 24:
    var operations = ['srlr', regA, regB, regC];
    ops.comment = regA + ' = ' + regB + ' >> ' + regC;
    break;
  case 25:
    var operations = ['sllr', regA, regB, regC];
    ops.comment = regA + ' = ' + regB + ' << ' + regC;
    break;
  case 26:
    var operations = ['cmpu', regA, regB, regC];
    ops.comment = '' // TODO:
    break;
  case 27:
    var operations = ['cmps', regA, regB, regC];
    ops.comment = '' // TODO:
    break;
  case 32:
  case 33:
  case 34:
  case 35:
  case 36:
  case 37:
  case 38:
  case 39:
    var operations = ['aluu', regA, regB, regC];
    ops.comment = '' // TODO:
    break;
  case 40:
  case 41:
  case 42:
  case 43:
  case 44:
  case 45:
  case 46:
  case 47:
    var operations = ['alus', regA, regB, regC];
    ops.comment = '' // TODO:
    break;
  default:
    throw "Invalid opcode 0x" + bytes[0] + "";
  };

  ops.address = address;
  ops.mnemonic = operations[0];
  ops.args = operations.slice(1);
  ops.comment = comment || ops.comment;
  ops.isIdtVector = address < idtSize;

  return new Instruction(ops);
};

/*
 * Decodes an array of words and returns the IDT and instruction
 * sections. Accepts two arguments:
 *
 *   words   An array of words encoded as 8 digit hexadecimal values.
 *   idtSize (optional) The size of the interrupt vector table.
 */
var words2sections = function(words, idtSize) {
  idtSize = idtSize || 0;

  var instructions = [], idt = [], address = 0, string = '', i = 0;
  var lastInstruction = (function(words) { // Optimisation to skip decoding junk NOPs
    for (i = words.length - 1; i >= 0; i--)
      if (parseInt(words[i]))
        return i + 1;
  })(words);

  try { // Parse instructions
    for (i = 0; i < lastInstruction; i++) {
      string = words[i].trim();

      if (string.length) {
        if (i < idtSize) { // Interrupt descriptor
          idt.push(word2instruction(string, address++, idtSize, 'Interrupt vector ' + i));
        } else {           // Instruction
          instructions.push(word2instruction(string, address++, idtSize));
        }
      }
    }
  } catch (err) { // Stop at first error and wrap exception with line no.
    throw "<strong>At line " + i + ":</strong> " + err;
  }

  return {
    instructions: instructions,
    idt: idt
  };
};

/*
 * Transforms a set of sections into a assembly program. Performs
 * minification of the source, skipping unecessary NOPs and reducing
 * the line count.
 */
var sections2prog = function(sections) {
  var instructions = sections.instructions, idt = sections.idt;
  var prog = [new Comment('Generated assembly, see:'),
              new Comment('    http://chriscummins.cc/disassembler'),
              new Comment(''),
              new BlankLine(),
              new Directive('cseg'),
              new Org(0),
              new BlankLine()], minProg = [];
  var currentAddress = 0;

  // Interrupt table label
  if (idt.length) {
    idt[0].label('', 'interrupt_vectors');
    idt.forEach(function(e) {
      prog.push(e);
      currentAddress++;
    });

    prog.push(new BlankLine());
    prog.push(new Org(currentAddress));
    prog.push(new BlankLine());
  }

  // Instructions
  if (instructions.length) {
    instructions[0].label('', '_main');

    instructions.forEach(function(e) {
      prog.push(e);
    });

    prog.push(new BlankLine());
  }

  prog.push(new Comment('End of program code'))

  // Generate label cross references
  prog.forEach(function(e) {
    try {
      e.html(instructions);
    } catch (err) {
      throw '<strong>At address 0x' + e.addressHex32 +
        ':</strong> Illegal branch address of ' + e.jumpAddress + '!';
    }
  });

  // Compact program code
  currentAddress = -1;
  prog.forEach(function(e) {
    if (!e.mnemonic || e._label || e.mnemonic !== 'nop') { // Skip NOP rows

      // Increment address for proper instructions
      if (e.mnemonic)
        currentAddress++;

      // Insert org directives to show jumps in memory
      if (e.address && e.address !== currentAddress) {
        currentAddress = e.address;

        minProg.push(new BlankLine());
        minProg.push(new Org(currentAddress));
      }

      // Add instruction
      minProg.push(e);
    }
  });

  return minProg;
};
