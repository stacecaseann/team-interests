const displayUsers = (_req, res) => {
  try {
    res.send(
      `<h1>Users and their Interests</h1>
            <ul>
            <li><a href='/stacy'>Stacy</a></li>
            <li><a href='/fernando'>Fernando</a></li>
            <li><a href='/ovinson'>Ovinson</a></li>
            <li><a href='/cris'>Cris</a></li>
            </ul>`,
    );
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

module.exports = {
  displayUsers,
};
