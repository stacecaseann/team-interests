const isAuthenticated = (req, res, next) => {
  // Allow fake GitHub token in test mode
  if (
    process.env.NODE_ENV === 'test' &&
    req.headers.authorization === 'Bearer testtoken'
  ) {
    return next();
  }

  // Regular auth check
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

module.exports = { isAuthenticated };
