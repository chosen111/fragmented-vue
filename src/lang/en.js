const LANG = {
  // Guild Application Errors
  E_ALREADY_APPLIED_TO_GUILD: "You have already applied to this guild!",

  get(key) {
    return this[key] || key;
  }
}

module.exports = LANG;