const ResponseUtil = {
  responseObject(data) {
    return data;
  },
  notificationObject(icon, text, type) {
    return { notification: { icon, text, type } };
  },
  errorObject(error) {
    return { error };
  }
}

module.exports = ResponseUtil;