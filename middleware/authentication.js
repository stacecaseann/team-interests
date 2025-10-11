const isAuthenticated = (req, res, next) => {
  console.log('User session:', req.session.user);
  if (req.session.user === undefined) {
    return res.status(481).json('You do not have access.');
  }
  next();
};

module.exports = {
  isAuthenticated,
};
