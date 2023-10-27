const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

module.exports = class School {
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
    this.schoolCollection = "schools";
    this.schoolExposed = [
      "addSchool",
      "assignAdmins",
      "editSchoolName",
      "deleteSchool",
      "createUser",
    ];

    // console.log("MODULE",config, cortex, managers, validators, mongomodels)
  }

  async createUser({ username, phone, password, role }) {
    const user = { username, phone, password, role }; // try

    // Data validation
    let result = await this.validators.user.createUser(user);
    if (result) return result;

    let existPhone = await this.mongomodels.user.findOne({ phone });
    if (existPhone) {
      return { error: "phone already in use" };
    }

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    user.password=hash
    const newUser = await this.mongomodels
      .user({ ...user, enabled: true })
      .save();

    // Response
    return {
      newUser,
    };
  }

  async deleteSchool({ id }) {
    const result = await this.validators.school.fetchSchool({
      id,
    });
    if (result) return result;

    const isExisted = await this.mongomodels.school.BaseModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      type: "school",
    });

    if (!isExisted)
      return {
        error: "NOT FOUND",
      };

    await this.mongomodels.school.BaseModel.deleteMany({
      $or: [
        { _id: new mongoose.Types.ObjectId(id) },
        { directParent: new mongoose.Types.ObjectId(id) },
        { parents: new mongoose.Types.ObjectId(id) },
      ],
    });
    return {
      msg: "Successfully Deleted",
    };
  }

  async editSchoolName({ id, name, location }) {
    const result = await this.validators.school.editSchoolName({
      id,
      name,
      location,
    });
    if (result) return result;
    const isExisted = await this.mongomodels.school.School.findOne({
      name,
    });
    if (isExisted) return { error: "Name Existed before" };

    let school = await this.mongomodels.school.School.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        type: "school",
      },
      { $set: { name, location } }
    );
    if (!school) return { error: "NOT FOUND" };
    return { msg: "Updated Successfully" };
  }

  async assignAdmins({ users, id }) {
    const result = await this.validators.school.assign({
      id,
      users,
    });
    if (result) return result;
    const usersIds = users.map((user) => new mongoose.Types.ObjectId(user));
    
    const isExisted = await this.mongomodels.school.BaseModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

    if (!isExisted)
      return {
        errors: "school not found ",
      };

    const assignedBefore = await this.mongomodels.school.School.findOne({
      admins: { $in: usersIds },
    });

    if (assignedBefore)
      return {
        error: "users assigned before ",
      };

    await this.mongomodels.school.School.updateOne(
      { _id: new mongoose.Types.ObjectId(id), type: "school" },
      { $set: { admins: [...isExisted.admins, ...usersIds] } }
    );
    return { msg: "Done" };
  }

  async addSchool({ name, location, res }) {
    const result = await this.validators.school.addSchool({
      name,
      location,
    });
    if (result) return result;

    const isExisted = await this.mongomodels.school.School.findOne({
      name,
    });
    if (isExisted) return { error: "Name Existed before" };

    const school = await this.mongomodels.school
      .School({
        location,
        name,
      })
      .save();
    return { school };
  }
};
