const emojis = require("../../public/emojis.data.json");

module.exports = {
  name: {
    path: "name",
    type: "string",
    length: { min: 3, max: 20 },
  },
  location: {
    path: "location",
    type: "string",
    length: { min: 3, max: 20 },
  },
  username: {
    path: "username",
    type: "string",
    length: { min: 3, max: 20 },
    custom: "username",
  },
  date: {
    path: "date",
    type: "string",
    length: { min: 3, max: 20 },
    // custom: 'date',
  },
  id: {
    // path: "title",
    path: "id",
    type: "string",
    // regex:"/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i"
    // length: { min: 3, max: 20 },
    // custom: 'title',
  },
  password: {
    path: "password",
    type: "string",
    length: { min: 8, max: 100 },
  },
  email: {
    path: "email",
    type: "string",
    length: { min: 3, max: 100 },
  },
  title: {
    path: "title",
    type: "string",
    length: { min: 3, max: 300 },
  },
  label: {
    path: "label",
    type: "string",
    length: { min: 3, max: 100 },
  },
  shortDesc: {
    path: "desc",
    type: "string",
    length: { min: 3, max: 300 },
  },
  longDesc: {
    path: "desc",
    type: "string",
    length: { min: 3, max: 2000 },
  },
  url: {
    path: "url",
    type: "string",
    length: { min: 9, max: 300 },
  },
  emoji: {
    path: "emoji",
    type: "Array",
    items: {
      type: "string",
      length: { min: 1, max: 10 },
      oneOf: emojis.value,
    },
  },
  price: {
    path: "price",
    type: "number",
  },
  avatar: {
    path: "avatar",
    type: "string",
    length: { min: 8, max: 100 },
  },
  text: {
    type: "String",
    length: { min: 3, max: 15 },
  },
  longText: {
    type: "String",
    length: { min: 3, max: 250 },
  },
  paragraph: {
    type: "String",
    length: { min: 3, max: 10000 },
  },
  phone: {
    type: "String",
    length: 13,
  },
  email: {
    type: "String",
    regex:
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  },
  number: {
    type: "Number",
    length: { min: 1, max: 6 },
  },
  users: {
    path: "users",
    type: "Array",
    items: {
      type: "String",
      // length: { min: 1, max: 100 },
      // regex:"/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i"
    },
  },
  code: {
    type: "String",
    length: 5,
  },
  obj: {
    type: "Object",
  },
  bool: {
    type: "Boolean",
  },

  role: {
    type: "String",
    path:"role",
    oneOf: ["STUDENT", "ADMIN", "SUPERADMIN"],
  },
};
