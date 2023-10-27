module.exports = {
  addSchool: [
    {
      model: "name",
      required: true,
      label: "name",
    },
    {
      model: "location",
      required: true,
      label: "location",
    },
  ],
  assign: [
    {
      model: "id",
      label: "id",
      required: true,
    },
    {
      model: "users",
      label: "users",
      required: true,
    },
  ],
  addClassroom: [
    {
      model: "name",
      required: true,
      label: "name",
    },
    {
      model: "id",
      label: "id",
      required: true,
    },
  ],
  fetchSchool: [
    {
      model: "id",
      label: "id",
      required: true,
    },
  ],
  editSchoolName: [
    {
      model: "id",
      label: "id",
      required: true,
    },
    {
      model: "name",
      required: true,
      label: "name",
    },
    {
      model: "location",
      required: false,
      label: "location",
    },
  ],
};
