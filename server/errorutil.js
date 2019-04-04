const ErrorUtil = {
  asNotification(err) {
    return { notification: err };
  },
  asObject(err) {
    return { error: err };
  }
}

module.exports = ErrorUtil;