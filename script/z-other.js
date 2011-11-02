window.uniqueId = function(length) {
  var id;
  if (length == null) {
    length = 8;
  }
  id = "";
  while (id.length < length) {
    id += Math.random().toString(36).substr(2);
  }
  return id.substr(0, length);
};
window.base64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
window.base64Encode = function(text) {
  var byteNum, cur, i, prev, result;
  i = 0;
  result = [];
  while (i < text.length) {
    cur = text.charCodeAt(i);
    byteNum = i % 3;
    switch (byteNum) {
      case 0:
        result.push(base64.charAt(cur >> 2));
        break;
      case 1:
        result.push(base64.charAt((prev & 3) << 4 | (cur >> 4)));
        break;
      case 2:
        result.push(base64.charAt((prev & 0x0f) << 2 | (cur >> 6)));
        result.push(base64.charAt(cur & 0x3f));
    }
    prev = cur;
    i++;
  }
  if (byteNum === 0) {
    result.push(base64.charAt((prev & 3) << 4));
    result.push("==");
  } else if (byteNum === 1) {
    result.push(base64.charAt((prev & 0x0f) << 2));
    result.push("=");
  }
  return result.join("");
};
window.base64Decode = function(text) {
  var cur, digitNum, i, prev, result;
  text = text.replace(/\s/g, "");
  if (!/^[a-z0-9\+\/\s]+\={0,2}$/i.test(text || text.length % 4 > 0)) {
    throw new Error("Not a base64-encoded string.");
  }
  i = 0;
  result = [];
  text = text.replace(/\=/g, "");
  while (i < text.length) {
    cur = base64.indexOf(text.charAt(i));
    digitNum = i % 4;
    switch (digitNum) {
      case 1:
        result.push(String.fromCharCode(prev << 2 | cur >> 4));
        break;
      case 2:
        result.push(String.fromCharCode((prev & 0x0f) << 4 | cur >> 2));
        break;
      case 3:
        result.push(String.fromCharCode((prev & 3) << 6 | cur));
    }
    prev = cur;
    i++;
  }
  return result.join("");
};
$(function() {
  $('body').onselectstart = function() {
    return false;
  };
  return window.a = new app;
});