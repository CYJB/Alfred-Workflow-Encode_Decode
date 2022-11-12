const outOfBoundsChar = String.fromCharCode(65533);

const getCodePoint = String.prototype.codePointAt
  ? (input, position) => input.codePointAt(position)
  : (input, position) => (input.charCodeAt(position) - 0xd800) * 0x400 + input.charCodeAt(position + 1) - 0xdc00 + 0x10000;

const fromCodePoint = String.fromCodePoint ||
  ((codePoint) => String.fromCharCode(Math.floor((codePoint - 0x10000) / 0x400) + 0xd800, ((codePoint - 0x10000) % 0x400) + 0xdc00));

/**
 * 编码指定的 HTML 实体。
 */
exports.encode = function (text) {
  if (!text) {
    return '';
  }
  const { namedCharacters } = require('html-named-characters');
  return replaceUsingRegExp(text, /[<>'"&]/g, (input) => {
    let result = namedCharacters[input];
    if (result) {
      return result;
    }
    const code = input.length > 1 ? getCodePoint(input, 0) : input.charCodeAt(0);
    return '&#' + code + ';';
  });
}

/** 用于解码的正则表达式 */
const decodeRegExp = /&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g;

/**
 * 解码指定的 HTML 实体。
 */
exports.decode = function (text) {
  if (!text) {
    return '';
  }

  const { namedEntities } = require('html-named-entities');
  return replaceUsingRegExp(text, decodeRegExp, (entity) => {
    let result = namedEntities[entity];
    if (result) {
      return result;
    }
    if (entity[0] === '&' && entity[1] === '#') {
      const decodeSecondChar = entity[2];
      const decodeCode = decodeSecondChar == 'x' || decodeSecondChar == 'X'
        ? parseInt(entity.substr(3), 16)
        : parseInt(entity.substr(2));
      return decodeCode >= 0x10ffff ? outOfBoundsChar : decodeCode > 65535
        ? fromCodePoint(decodeCode)
        : fromCharCode(numericUnicodeMap[decodeCode] || decodeCode);
    } else {
      return entity;
    }
  });
}

/**
 * 使用指定的正则表达式替换字符串。
 */
function replaceUsingRegExp(text, regex, replacer) {
  regex.lastIndex = 0;
  let replaceMatch = regex.exec(text);
  let replaceResult;
  if (replaceMatch) {
    replaceResult = '';
    let replaceLastIndex = 0;
    do {
      if (replaceLastIndex !== replaceMatch.index) {
        replaceResult += text.substring(replaceLastIndex, replaceMatch.index);
      }
      const replaceInput = replaceMatch[0];
      replaceResult += replacer(replaceInput);
      replaceLastIndex = replaceMatch.index + replaceInput.length;
    } while ((replaceMatch = regex.exec(text)));

    if (replaceLastIndex !== text.length) {
      replaceResult += text.substring(replaceLastIndex);
    }
  } else {
    replaceResult = text;
  }
  return replaceResult;
}
