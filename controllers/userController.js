const displayUsers = (req, res) => {
  //#swagger.tags = ['Users']
  //#swagger.summary = 'Displays a list of users.'
  try {
    let statusMessage = '';
    let statusLink = '';
    if (req.session.user) {
      statusMessage = `You are logged in as: ${req.session.user}`;
      statusLink = '<a href="/logout">Logout</a>';
    } else {
      statusMessage = 'You are not logged in. There may be limited access.';
      statusLink = '<a href="/login">Login with GitHub</a>';
    }
    res.send(
      `<h1>Users and their Interests</h1>
            <p>${statusMessage}</p>
            <ul>
            <li><a href='/users/stacy'>Stacy</a></li>
            <li><a href='/users/fernando'>Fernando</a></li>
            <li><a href='/users/ovinson'>Ovinson</a></li>
            <li><a href='/users/cris'>Cris</a></li>
            <li><a href='/users/edeli'>Edeli</a></li>
            <li><a href='/users/brantley'>Brantley</a></li>
            </ul>

            ${statusLink}`,
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
    edeli: { interests: 'favoritebooks' },
    brantley: { interests: 'speakers'}
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
