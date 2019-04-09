const LANG = {
  // Guild Application
  I_GUILD_APPLICATION_POSTED: "Your application has been submitted!",
  I_GUILD_APPLICATION_EDITED: "Your application has been modified!",
  I_GUILD_APPLICATION_CANCELLED: "Your application has been cancelled!",
  E_ALREADY_APPLIED_TO_GUILD: "You have already applied to this guild!",
  E_GUILD_APPLICATION_IS_CANCELLED: "You cannot modify a cancelled application!",
  E_GUILD_APPLICATION_IS_FINAL: "You cannot modify an application 6 hours after it has been created!",

  // BNet
  E_NOT_LOGGED_WITH_BNET: "You have to log in with your Battle Net account before using this feature!",
  I_BNET_AUTHORIZED: "Your Battle Net account has been authorized!",
  I_BNET_DEAUTHORIZED: "Your Battle Net account has been deauthorized!",

  get(key) {
    return this[key] || key;
  }
}

module.exports = LANG;