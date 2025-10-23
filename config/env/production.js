module.exports = {
  blueprints: {
    shortcuts: false,
  },

  adminpanel: {
    auth: true,
  },
  log: {
    level:
      process.env.LOG_LEVEL === undefined
        ? "error"
        : process.env.LOG_LEVEL,
  },
  port: process.env.PORT === undefined ? 42880 : process.env.PORT,
};
