class ValidateError extends Error {
  constructor(message, fields) {
    super(message);
    this.name = "ValidateError";
    this.fields = fields;
  }
}

class PropertyRequiredError extends ValidateError {
  constructor(property) {
    super("No property: " + property);
    this.name = "PropertyRequiredError";
    this.property = property;
  }
}

const serializer = {
  stringify() {
    for (let field in this) {
      if (typeof(this[field]) == 'object') {
        this[field] = JSON.stringify(this[field]);
      }
    }
    return this;
  }
}

const validators = {
  guildApplication() {
    let error = { };
    if (!this.battleTag || this.battleTag.length == 0) {
      error.battleTag = "We could not parse your BNet Battle Tag!";
    }
    if (!this.character || this.character.length == 0) {
      error.character = "You must select a character!";
    }
    if (!this.role.find(role => role == 1)) {
      error.role = "You must select a role!";
    }
    if (!this.about || this.about.length < 50) {
      error.about = "Your description must have at least 50 characters!";
    }
    if (!this.applyReason || this.applyReason.length < 50) {
      error.applyReason = "The reason you're applying must have at least 50 characters!";
    }
    if (!this.addition || this.addition.length < 50) {
      error.addition = "The reason why you think you can be a good addition must have at least 50 characters!";
    }
    if (!this.played || this.played.length < 50) {
      error.played = "Your play history must have at least 50 characters!";
    }
    if (!this.raider || this.raider.length < 50) {
      error.raider = "Your raider history must have at least 50 characters!";
    }
    if (!this.experience || this.experience.length < 50) {
      error.experience = "Your experience history must have at least 50 characters!";
    }
    for (let key in error) {
      throw new ValidateError("A field failed the guildApplication validator!", error);
    }
    return this;
  }
}

const fn = {
  run(validator, data) {
    if (typeof(validators[validator]) != 'function') throw new Error(`Invalid validator specified ${validator}`);
    return serializer.stringify.call(validators[validator].call(data));
  }  
}

module.exports = { ValidateError, fn };
