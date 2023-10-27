const mongoose = require("mongoose");

// Define a Mongoose schema with the specified properties
const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  role: {
    type: String,
    default: "STUDENT",
    enum: ["STUDENT", "ADMIN", "SUPERADMIN"],
  },
  date: {
    type: String,
    minlength: 3,
    maxlength: 20,
  },
  title: {
    type: String,
    minlength: 3,
    maxlength: 20,
  },
  code: {
    type: String,
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 100,
  },
  email: {
    type: String,
    minlength: 3,
    maxlength: 100,
  },
  label: {
    type: String,
    minlength: 3,
    maxlength: 100,
  },
  shortDesc: {
    type: String,
    minlength: 3,
    maxlength: 300,
  },
  longDesc: {
    type: String,
    minlength: 3,
    maxlength: 2000,
  },
  url: {
    type: String,
    minlength: 9,
    maxlength: 300,
  },
  emoji: {
    type: [String],
    validate: {
      validator: function (value) {
        // You can add custom validation logic here
        // Make sure that the value is an array and elements meet your criteria
        return (
          Array.isArray(value) &&
          value.every((item) => emojis.value.includes(item))
        );
      },
      message: "Invalid emoji values",
    },
  },
  price: Number,
  avatar: {
    type: String,
    minlength: 8,
    maxlength: 100,
  },
  text: {
    type: String,
    minlength: 3,
    maxlength: 15,
  },
  longText: {
    type: String,
    minlength: 3,
    maxlength: 250,
  },
  paragraph: {
    type: String,
    minlength: 3,
    maxlength: 10000,
  },
  phone: {
    type: String,
    maxlength: 13,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    validate: {
      validator: function (value) {
        // You can add custom email validation logic here
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value
        );
      },
      message: "Invalid email format",
    },
  },
  number: {
    type: Number,
    min: 1,
    max: 6,
  },
  enabled: {
    default: false,
    type: Boolean,
  },
  // arrayOfStrings: {
  //   type: [String],
  //   validate: {
  //     validator: function (value) {
  //       // You can add custom validation logic for the array here
  //       return (
  //         Array.isArray(value) &&
  //         value.every((item) => item.length >= 3 && item.length <= 100)
  //       );
  //     },
  //     message: "Invalid array values",
  //   },
  // },
  obj: Object,
  bool: Boolean,
});

// Create a Mongoose model based on the schema
const userModel = mongoose.model("users", usersSchema);

// Export the model for use in your application
module.exports = userModel;
