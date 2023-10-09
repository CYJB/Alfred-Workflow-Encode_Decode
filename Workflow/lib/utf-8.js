/**
 * 将指定字符编码为 UTF-8 形式。
 * @param {number} charCode 要编码的字符。
 * @param {number[]} output 编码结果。
 */
function encodeUTF8Char(charCode, output) {
  if (charCode < 0xFF) {
    output.push(charCode);
  } else if (charCode < 0x800) {
    output.push(0xC0 | ((charCode >> 6) & 0x1F));
    output.push(0x80 | ((charCode >> 0) & 0x3F));
  } else {
    output.push(0xE0 | ((charCode >> 12) & 0x0F));
    output.push(0x80 | ((charCode >> 6) & 0x3F));
    output.push(0x80 | ((charCode >> 0) & 0x3F));
  }
}

/**
 * UTF-8 的解码器。
 */
class UTF8Decoder {
  /**
   * 当前解码状态
   * @type { 0 | 1 | 2 }
   */
  _state = 0;
  /**
   * 解码的临时值
   * @type { number }
   */
  _value = 0;
  /**
   * 将指定 UTF-8 字符解码为 Unicode 字符。
   * @param {number} char 要解码的字符。
   * @param {string[]} output 解码结果。
   */
  decodeChar(char, output) {
    switch (this._state) {
      case 0:
        // 默认状态
        switch (char >> 4) {
          case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
            // 0xxxxxxx
            output.push(String.fromCharCode(char));
            break;
          case 12: case 13:
            // 110x xxxx   10xx xxxx
            this._value = (char & 0x1F) << 6;
            this._state = 1;
            break;
          case 14:
            // 1110 xxxx  10xx xxxx  10xx xxxx
            this._state = 2;
            this._value = (char & 0x0F) << 12;
            break;
        }
        break;
      case 1:
        // 110x 的第二个部分，或者 111x 的第三个部分
        output.push(String.fromCharCode(this._value | (char & 0x3F)));
        this._state = 0;
        break;
      case 2:
        // 111x 的第二个部分
        this._value |= (char & 0x3F) << 6;
        this._state = 1;
        break;
    }
  }
}

module.exports = { encodeUTF8Char, UTF8Decoder };
