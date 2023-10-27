const { default: mongoose } = require("mongoose");

module.exports = ({ meta, config, managers, mongomodels }) => {
  return async ({ req, res, next }) => {
    if (!req.headers.token) {
      console.log("token required but not found");
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "unauthorized",
      });
    }
    let decoded = null;
    try {
      decoded = managers.token.verifyShortToken({ token: req.headers.token });
      if (!decoded) {
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 401,
          errors: "unauthorized",
        });
      }

      const user = await mongomodels.user.findOne({
        _id: new mongoose.Types.ObjectId(decoded.userId),
      });

      if (!user.enabled)
        return managers.responseDispatcher.dispatch(res, {
          ok: false,
          code: 401,
          errors: "User Disabled",
        });

      /// disabled

      req.me = user;
    } catch (err) {
      console.log("failed to decode-2");
      console.log(err);
      return managers.responseDispatcher.dispatch(res, {
        ok: false,
        code: 401,
        errors: "unauthorized",
      });
    }

    next(decoded);
  };
};
