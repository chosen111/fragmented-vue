const util = {
  uuid_v4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = (c == 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
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
}

export default util;