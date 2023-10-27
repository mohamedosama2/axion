const { default: mongoose } = require("mongoose");

module.exports = class User {
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
    this.usersExposed = [
      "get=fetchSchool",
      "get=fetchClassRoom",
      "get=fetchAllClassRooms",
      "get=fetchAllSchools",
      "get=schoolStatistics",
    ];
  }
  async schoolStatistics() {
    return await this.mongomodels.school.BaseModel.aggregate([
      { $match: { type: "classroom" } },
      {
        $addFields: {
          studentsCount: { $size: "$students" },
        },
      },
      {
        $group: {
          _id: "$directParent",
          classRooms: { $sum: 1 },
          studentsNumber: { $sum: "$studentsCount" },
        },
      },
      {
        $lookup: {
          from: "baseschools",
          localField: "_id",
          foreignField: "_id",
          as: "schoolData",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
        },
      },
      { $unwind: "$schoolData" },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
  }

  async fetchSchool({ __query }) {
    const { id } = __query;
    let result = await this.validators.school.fetchSchool({ id });
    if (result) return result;

    const school = await this.mongomodels.school.BaseModel.aggregate([
      {
        $match: {
          $or: [
            { _id: new mongoose.Types.ObjectId(id), type: "school" },
            { parents: new mongoose.Types.ObjectId(id) },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "students",
          foreignField: "_id",
          as: "students",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                phone: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "admins",
          foreignField: "_id",
          as: "admins",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                phone: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          parents: 0,
          directParent: 0,
          __v: 0,
        },
      },
      {
        $group: {
          _id: null,
          schoolData: {
            $first: {
              $cond: [{ $eq: ["$type", "school"] }, "$$ROOT", "$$REMOVE"],
            },
          },
          classRoomsData: {
            $push: {
              $cond: [{ $eq: ["$type", "classroom"] }, "$$ROOT", "$$REMOVE"],
            },
          },
        },
      },
    ]);

    if (school.length === 0)
      return {
        error: "NOT FOUND",
      };

    return { school };
  }
  async fetchAllClassRooms() {
    const classrooms = await this.mongomodels.school.BaseModel.aggregate([
      {
        $match: {
          type: "classroom",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "students",
          foreignField: "_id",
          as: "students",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                phone: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          parents: 0,
          directParent: 0,
          __v: 0,
        },
      },
    ]);

    if (classrooms.length === 0)
      return {
        error: "NOT FOUND",
      };

    return { classrooms };
  }
  async fetchAllSchools() {
    const schools = await this.mongomodels.school.BaseModel.aggregate([
      {
        $match: {
          type: "school",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "admins",
          foreignField: "_id",
          as: "admins",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                phone: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          parents: 0,
          directParent: 0,
          __v: 0,
        },
      },
    ]);

    if (schools.length === 0)
      return {
        error: "NOT FOUND",
      };

    return { schools };
  }
  async fetchClassRoom({ __query }) {
    const {id} = __query;
    let result = await this.validators.school.fetchSchool({ id });
    if (result) return result;

    const classRoom = await this.mongomodels.school.BaseModel.aggregate([
      {
        $match: {
          $or: [{ _id: new mongoose.Types.ObjectId(id), type: "classroom" }],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "students",
          foreignField: "_id",
          as: "students",
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                phone: 1,
              },
            },
          ],
        },
      },

      {
        $project: {
          parents: 0,
          directParent: 0,
          __v: 0,
        },
      },
    ]);

    if (classRoom.length === 0) return { error: "NOT FOUND" };

    return { classRoom };
  }
};
