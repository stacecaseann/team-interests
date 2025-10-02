const getHome = (_req, res) => {
  try {
    res.send(
      `<h1>Welcome to InterestsAPI</h1>
            <p>Please click on the link below to know the interests of every user in this team:</p>
            <a href="/users">Go to Users</a>`,
    );
  } catch (err) {
    res.status(500).json({ message: 'Error fetching home', error: err }); // Internal Server Error
  }
};

module.exports = {
  getHome,
};
