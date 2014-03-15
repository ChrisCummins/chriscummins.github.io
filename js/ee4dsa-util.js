/*
 * util.js - EE4DSA disassembler utility functions
 */

/*
 * Pad the number 'n' to with padding character 'z' to width
 * 'width'. If 'prefix' is true, pad the leading edge.
 */
function pad(n, width, z, prefix) {
  z = z || '0';
  n = n + '';
  // Pop out any html tags when calculating length
  var length = n.replace(/<\/?[a-zA-Z ="]+>/g, '').length;

  return length >= width ? n : prefix ?
    n + new Array(width - length + 1).join(z) :
    new Array(width - length + 1).join(z) + n;
}

/*
 * Casts a decimal integer to a hexadecimal string.
 */
var int2hex = function(n) {
  return n ? n.toString(16).toUpperCase() : '';
};

/*
 * Casts a decimal integer to a 32 bit hexadecimal string (0 padded).
 */
var int2hex32 = function(n) {
  return n ? pad(int2hex(n), 8) : '';
};
