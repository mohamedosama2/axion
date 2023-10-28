const { default: mongoose } = require("mongoose");

module.exports = class Classes {
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
    this.classExposed = ["addClassroom", "assignStudents"];

    // console.log("MODULE",config, cortex, managers, validators, mongomodels)
  }

  async assignStudents({ users, id }) {
    const result = await this.validators.school.assign({
      id,
      users,
    });
    if (result) return result;

    const usersIds = users.map((user) => new mongoose.Types.ObjectId(user));

    const isExisted = await this.mongomodels.school.BaseModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      type: "classroom",
    });

    if (!isExisted)
      return {
        errors: "Not found ",
      };

    const assignedBefore = await this.mongomodels.school.BaseModel.findOne({
      students: { $in: usersIds },
      type: "classroom",
    });

    if (assignedBefore)
      return {
        error: "users assigned before ",
      };

    await this.mongomodels.school.BaseModel.updateOne(
      { _id: new mongoose.Types.ObjectId(id), type: "classroom" },
      { $set: { students: [...isExisted.students, ...usersIds] } }
    );
    return { msg: "Done" };
  }

  async addClassroom({ name, id, res }) {
    const result = await this.validators.school.addClassroom({
      name,
      id,
    });
    if (result) return result;

    const isExisted = await this.mongomodels.school.BaseModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      type: "school",
    });
    if (!isExisted) return { error: "School not existed" };

    /// abillity

    const isAuthorized = await this.mongomodels.school.BaseModel.findOne({
      admins: new mongoose.Types.ObjectId(res.req.me._id),
      _id: new mongoose.Types.ObjectId(id),
      type: "school",
    });
    if (!isAuthorized && res.req.me.role !== "SUPERADMIN") {
      return {
        error: "UnAuthorized",
      };
    }

    const classroom = await this.mongomodels.school
      .BaseModel({
        name,
        type: "classroom",
        parents: [new mongoose.Types.ObjectId(id)],
        directParent: [new mongoose.Types.ObjectId(id)],
      })
      .save();
    return { classroom };
  }
};
