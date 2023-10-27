module.exports = {
  fetchAllUsers: [
    {
      model: "role",
      path: "role",
      label: "role",
      required: false,
    },
  ],
  createUser: [
    {
      model: "username",
      required: true,
      path: "username",
      label: "username",
    },
    {
      model: "password",
      required: true,
      path: "password",
      label: "password",
    },
    {
      model: "phone",
      label: "phone",
      path: "phone",
      required: true,
    },

    {
      model: "role",
      path: "role",
      label: "role",
      required: true,
    },
  ],
  login: [
    {
      model: "phone",
      label: "phone",
      path: "phone",
      required: true,
    },
    {
      model: "password",
      required: true,
      label: "password",
    },
  ],
  verify: [
    {
      model: "phone",
      label: "phone",
      path: "phone",
      required: true,
    },
    {
      model: "code",
      required: true,
      label: "code",
      path: "code",
    },
  ],
  register: [
    {
      model: "phone",
      label: "phone",
      path: "phone",
      required: true,
    },
    {
      model: "password",
      required: true,
      label: "password",
      path: "password",
    },
    {
      model: "username",
      required: true,
      label: "username",
      path: "username",
    },
  ],
};
