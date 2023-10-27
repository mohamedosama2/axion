const mongoose = require("mongoose");

// Define the base schema for the school
const bseSchema = new mongoose.Schema({
  parents: {
    type: [mongoose.Types.ObjectId],
    required: true,
    ref: "baseschool",
  },
  directParent: {
    type: [mongoose.Types.ObjectId],
    required: true,
  },
});

// Create the first discriminator schema for Public Schools
const schoolSchema = new mongoose.Schema({
  location: {
    type: String,
    minlength: 3,
    maxlength: 100,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  admins: [
    {
      type: mongoose.Types.ObjectId,
      ref: "users", // Specify the referenced model if needed
    },
  ],
});

// Create the second discriminator schema for Private Schools
const classroomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  students: [
    {
      type: mongoose.Types.ObjectId,
      ref: "users", // Specify the referenced model if needed
    },
  ],
});

// Set discriminator keys and create models based on the discriminators
bseSchema.set("discriminatorKey", "type");

const BaseModel = mongoose.model("baseschool", bseSchema);
const School = BaseModel.discriminator("school", schoolSchema);
const ClasSroom = BaseModel.discriminator("classroom", classroomSchema);
module.exports = {
  BaseModel,
  School,
  ClasSroom,
};
