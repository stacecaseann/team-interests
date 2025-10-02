const displayUsers = (_req, res) => {
  try {
    res.send(
      `<h1>Users and their Interests</h1>
            <ul>
            <li><a href='/users/stacy'>Stacy</a></li>
            <li><a href='/users/fernando'>Fernando</a></li>
            <li><a href='/users/ovinson'>Ovinson</a></li>
            <li><a href='/users/cris'>Cris</a></li>
            </ul>`,
    );
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

const getUser = (req, res) => {
  const { username } = req.params;
  const users = {
    stacy: { interests: 'recipes' },
    fernando: { interests: 'scriptures' },
    ovinson: { interests: 'movies' },
    cris: { interests: 'speakers' },
  };
  const user = users[username];
  if (user) {
    res.redirect(`/${user.interests}`);
  } else {
    res.status(404).send('User not found');
  }
};

module.exports = {
  displayUsers,
  getUser,
};
