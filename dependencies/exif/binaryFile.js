/**
 * Created by huangjin02 on 13-12-26.
 */

define([], function() {
  var BinaryFile = function(strData, iDataOffset, iDataLength) {
    var data = strData;
    var dataOffset = iDataOffset || 0;
    var dataLength = 0;

    dataLength = iDataLength || data.length;

    this.getByteAt = function(iOffset) {
      return data.charCodeAt(iOffset + dataOffset) & 0xFF;
    };

    this.getBytesAt = function(iOffset, iLength) {
      var aBytes = [];

      for (var i = 0; i < iLength; i++) {
        aBytes[i] = data.charCodeAt((iOffset + i) + dataOffset) & 0xFF
      }

      return aBytes;
    };

    this.getLength = function() {
      return dataLength;
    };

    this.getShortAt = function(iOffset, bBigEndian) {
      var iShort = bBigEndian ?
        (this.getByteAt(iOffset) << 8) + this.getByteAt(iOffset + 1)
        : (this.getByteAt(iOffset + 1) << 8) + this.getByteAt(iOffset);
      if (iShort < 0) iShort += 65536;
      return iShort;
    };

    this.getLongAt = function(iOffset, bBigEndian) {
      var iByte1 = this.getByteAt(iOffset),
        iByte2 = this.getByteAt(iOffset + 1),
        iByte3 = this.getByteAt(iOffset + 2),
        iByte4 = this.getByteAt(iOffset + 3);

      var iLong = bBigEndian ?
        (((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
        : (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
      if (iLong < 0) iLong += 4294967296;
      return iLong;
    };
    this.getSLongAt = function(iOffset, bBigEndian) {
      var iULong = this.getLongAt(iOffset, bBigEndian);
      if (iULong > 2147483647)
        return iULong - 4294967296;
      else
        return iULong;
    };

    this.getStringAt = function(iOffset, iLength) {
      var aStr = [];

      var aBytes = this.getBytesAt(iOffset, iLength);
      for (var j=0; j < iLength; j++) {
        aStr[j] = String.fromCharCode(aBytes[j]);
      }
      return aStr.join("");
    };

  };

  return BinaryFile;
});