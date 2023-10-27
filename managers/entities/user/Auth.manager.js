const bcrypt = require("bcryptjs");
const smsService = require("../../../libs/sms");
const _ = require('lodash');

module.exports = class Auth {
  constructor({
    utils,
    cache,
    config,
    cortex,
    managers,
    validators,
    mongomodels,
  } = {}) {
    this.config = config;
    this.cortex = cortex;
    this.validators = validators;
    this.mongomodels = mongomodels;
    this.tokenManager = managers.token;
    this.usersCollection = "users";
    this.authExposed = ["login", "register", "verify", "get=fetchAllUsers"];
    this.managers = managers;
    this.utils = utils;
  }

  async fetchAllUsers({ __query }) {
    let result = await this.validators.user.fetchAllUsers({
      ...__query,
    });
    if (result) return result;
    if (_.isUndefined(__query.role)) {
      delete __query.role;
    }
    return await this.mongomodels.user.find(__query);
  }

  async register({ res, phone, password, username }) {
    let result = await this.validators.user.register({
      phone,
      password,
      username,
    });
    if (result) return result;

    let existPhone = await this.mongomodels.user.findOne({ phone });
    if (existPhone) {
      return { error: "phone already in use" };
    }
    const code = this.utils.generateRandom5DigitNumber();

    await smsService.sendVerificationCode(phone, code);

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    password = hash;
    const user = await this.mongomodels
      .user({ phone, password, username, code })
      .save();

    return {
      msg: "done",
      user,
    };
  }

  async login({ phone, password, res }) {
    let result = await this.validators.user.login({ phone, password });
    if (result) return result;

    // check that in db

    const user = await this.mongomodels.user.findOne({ phone });

    if (!user) return { error: "user not found" };

    // check that it enabled

    if (!user.enabled) return { error: "disabled user" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "invalid phone or password" };
    }

    let longToken = this.tokenManager.genLongToken({
      userId: user._id,
      userKey: user.key,
    });

    // Response
    return {
      user,
      longToken,
    };
  }

  async verify({ phone, code }) {
    const user = await this.mongomodels.user.findOne({ phone });
    if (!user) return { error: "user not found" };

    let result = await this.validators.user.verify({ phone, code });
    if (result) return result;

    // check if code which send to user is equal to code which entered by him

    if (user.code != code) {
      return { error: "code is incorrect" };
    }

    await user.set({ enabled: true }).save();

    let longToken = this.tokenManager.genLongToken({
      userId: user._id,
      userKey: user.key,
    });

    // Response
    return {
      user,
      longToken,
    };
  }
};
