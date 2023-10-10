#! /usr/bin/osascript -l JavaScript

const app = Application.currentApplication();
app.includeStandardAdditions = true;


function test(command, expected) {
  const info = `test "${command}"`;
  try {
    const value = app.doShellScript(command);
    if (value === JSON.stringify(expected)) {
      console.log(info, 'success');
    } else {
      console.log(info, 'value', JSON.stringify(JSON.parse(value), undefined, 2),
        'not equal to expected', JSON.stringify(expected, undefined, 2));
    }
  } catch (e) {
    console.log(info, 'failed:', e);
  }
}

test('./encode.js "中文&\\$>"', {
  items: [
    { uid: 'URL', icon: { path: './icons/Encode_URL.png' }, title: '%E4%B8%AD%E6%96%87%26%24%3E', subtitle: '编码 URL', arg: '%E4%B8%AD%E6%96%87%26%24%3E' },
    { uid: 'HTML', icon: { path: './icons/Encode_HTML.png' }, title: '中文&amp;$&gt;', subtitle: '编码 HTML', arg: '中文&amp;$&gt;' },
    { uid: 'Base64', icon: { path: './icons/Encode_Base64.png' }, title: '5Lit5paHJiQ+', subtitle: '编码 Base64', arg: '5Lit5paHJiQ+' },
  ]
});

test('./encode.js "https://github.com/CYJB/Alfred-Workflow-Encode_Decode?1234567890中123文%6422=qwertyuiopsdfghp[;./.,lkjhzxcvbnm,.测试，。￥！@#访问方法"', {
  items: [
    { uid: 'URL', icon: { path: './icons/Encode_URL.png' }, title: 'https%3A%2F%2Fgithub.com%2FCYJB%2FAlfred-Workflow-Encode_Decode%3F1234567890%E4%B8%AD123%E6%96%87%256422%3Dqwertyuiopsdfghp%5B%3B.%2F.%2Clkjhzxcvbnm%2C.%E6%B5%8B%E8%AF%95%EF%BC%8C%E3%80%82%EF%BF%A5%EF%BC%81%40%23%E8%AE%BF%E9%97%AE%E6%96%B9%E6%B3%95', subtitle: '编码 URL', arg: 'https%3A%2F%2Fgithub.com%2FCYJB%2FAlfred-Workflow-Encode_Decode%3F1234567890%E4%B8%AD123%E6%96%87%256422%3Dqwertyuiopsdfghp%5B%3B.%2F.%2Clkjhzxcvbnm%2C.%E6%B5%8B%E8%AF%95%EF%BC%8C%E3%80%82%EF%BF%A5%EF%BC%81%40%23%E8%AE%BF%E9%97%AE%E6%96%B9%E6%B3%95' },
    { uid: 'Base64', icon: { path: './icons/Encode_Base64.png' }, title: 'aHR0cHM6Ly9naXRodWIuY29tL0NZSkIvQWxmcmVkLVdvcmtmbG93LUVuY29kZV9EZWNvZGU/MTIzNDU2Nzg5MOS4rTEyM+aWhyU2NDIyPXF3ZXJ0eXVpb3BzZGZnaHBbOy4vLixsa2poenhjdmJubSwu5rWL6K+V77yM44CC77+l77yBQCPorr/pl67mlrnms5l=', subtitle: '编码 Base64', arg: 'aHR0cHM6Ly9naXRodWIuY29tL0NZSkIvQWxmcmVkLVdvcmtmbG93LUVuY29kZV9EZWNvZGU/MTIzNDU2Nzg5MOS4rTEyM+aWhyU2NDIyPXF3ZXJ0eXVpb3BzZGZnaHBbOy4vLixsa2poenhjdmJubSwu5rWL6K+V77yM44CC77+l77yBQCPorr/pl67mlrnms5l=' },
  ]
});

test('./decode.js "中文&\\$>"', {
  items: [
    { uid: 'None', title: '无解码结果', subtitle: '解码后的字符串与原始内容一致', valid: false },
  ]
});

test('./decode.js "%E4%B8%AD%E6%96%87%26%24%3E"', {
  items: [
    { uid: 'URL', icon: { path: './icons/Decode_URL.png' }, title: '中文&$>', subtitle: '解码 URL', arg: '中文&$>' },
  ]
});

test('./decode.js "中文&amp;$&gt;"', {
  items: [
    { uid: 'HTML', icon: { path: './icons/Decode_HTML.png' }, title: '中文&$>', subtitle: '解码 HTML', arg: '中文&$>' },
  ]
});

test('./decode.js "5Lit5paHJiQ+"', {
  items: [
    { uid: 'Base64', icon: { path: './icons/Decode_Base64.png' }, title: '中文&$>', subtitle: '解码 Base64', arg: '中文&$>' },
  ]
});

test('./md5.js "中文&\\$>"', {
  items: [
    { uid: 'MD5_hex', icon: { path: './icons/Encode_MD5.png' }, title: '8930740309a30f25d2acced86f6bf813', subtitle: 'MD5(十六进制)', arg: '8930740309a30f25d2acced86f6bf813' },
    { uid: 'MD5_base64', icon: { path: './icons/Encode_MD5.png' }, title: 'iTB0AwmjDyXSrM7Yb2v4Ew==', subtitle: 'MD5(Base64)', arg: 'iTB0AwmjDyXSrM7Yb2v4Ew==' },
  ]
});

test('./md5.js "https://github.com/CYJB/Alfred-Workflow-Encode_Decode?1234567890中123文%6422=qwertyuiopsdfghp[;./.,lkjhzxcvbnm,.测试，。￥！@#访问方法"', {
  items: [
    { uid: 'MD5_hex', icon: { path: './icons/Encode_MD5.png' }, title: '524be65835103079959f7822905c845c', subtitle: 'MD5(十六进制)', arg: '524be65835103079959f7822905c845c' },
    { uid: 'MD5_base64', icon: { path: './icons/Encode_MD5.png' }, title: 'UkvmWDUQMHmVn3gikFyEXA==', subtitle: 'MD5(Base64)', arg: 'UkvmWDUQMHmVn3gikFyEXA==' },
  ]
});

test('./crc32.js "中文&\\$>"', {
  items: [
    { uid: 'CRC32_10', icon: { path: './icons/Encode_CRC32.png' }, title: '1075894535', subtitle: 'CRC32(十进制)', arg: '1075894535' },
    { uid: 'CRC32_16', icon: { path: './icons/Encode_CRC32.png' }, title: '4020d907', subtitle: 'CRC32(十六进制)', arg: '4020d907' },
  ]
});

test('./crc32.js "https://github.com/CYJB/Alfred-Workflow-Encode_Decode?1234567890中123文%6422=qwertyuiopsdfghp[;./.,lkjhzxcvbnm,.测试，。￥！@#访问方法"', {
  items: [
    { uid: 'CRC32_10', icon: { path: './icons/Encode_CRC32.png' }, title: '4214783103', subtitle: 'CRC32(十进制)', arg: '4214783103' },
    { uid: 'CRC32_16', icon: { path: './icons/Encode_CRC32.png' }, title: 'fb387c7f', subtitle: 'CRC32(十六进制)', arg: 'fb387c7f' },
  ]
});

console.log('test finished')
