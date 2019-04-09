const util = {
  uuid_v4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = (c == 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
  },
  hasClass(element, className) {
    if ((` ${element.className} `).replace(/[\n\t\r]/g, " ").indexOf(` ${className} `) != -1) {
      return true;
    }
    return false;
  },
  selector(el) {
    let computedSelector = "";
    do {
      if (el.tagName == "BODY") break;

      let currentSelector = el.tagName.toLowerCase();
      if (el.id) currentSelector += `#${el.id}`;
      if (el.className) currentSelector += `.${el.className.split(' ').join('.')}`;
      computedSelector = `${currentSelector} ${computedSelector}`;
    } while (el = el.parentElement)

    return computedSelector;
  },
  offset(el) {
    let left = 0;
    let top = 0;

    do {
      left += el.offsetLeft;
      top += el.offsetTop;
    } while (el = el.offsetParent)

    return { left, top }
  },
  getRandomInt(min, max) {
    return Math.floor((Math.random() * Math.floor(max - min)) + min)
  },
  clampMin(n, min) {
    return (n < min) ? min : n;
  },
  clampMax(n, max) {
    return (n > max) ? max : n;
  },
  clampRange(n, start, end) {
    return (n < start) ? start : (n > end) ? end : n
  },
  clampLoop(n, start, end) {
    return (n < start) ? end : (n > end) ? start : n;
  }
}

export default util;