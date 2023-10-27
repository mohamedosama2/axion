module.exports = ({ meta, config, managers }) => {
  return ({ req, res, next }) => {
    if (req.me.role == "SUPERADMIN") return next();
    return managers.responseDispatcher.dispatch(res, {
      ok: false,
      code: 403,
      errors: "Forbidden",
    });
  };
};
