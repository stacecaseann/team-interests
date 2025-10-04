const Movie = require('../schemas/MovieSchema');

const getMovies = async (req, res) => {
  //#swagger.tags = ['Movies']
  //#swagger.summary = 'Gets all movies.'
  try {
    const result = await Movie.find();
    if (result.length === 0) {
      return res.status(404).json({ error: 'No movies found' });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch movies' });
  }
};

const getMovieById = async (req, res) => {
  //#swagger.tags = ['Movies']
  //#swagger.summary = 'Gets a movie by ID.'
  const { id } = req.params;
  try {
    const result = await Movie.findById(id);
    if (!result) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch movie' });
  }
};

const createMovie = async (req, res) => {
  //#swagger.tags = ['Movies']
  //#swagger.summary = 'Creates a new movie.'
  try {
    const result = await Movie.create({
      title: req.body.title,
      director: req.body.director,
      language: req.body.language,
      year: req.body.year,
      genre: req.body.genre,
      synopsis: req.body.synopsis,
    });
    return res.status(201).json(result);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: 'A movie with the same title already exists' });
    }
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ error: 'Validation failed', details: validationErrors });
    }
    return res.status(500).json({ error: 'Failed to create movie' });
  }
};

const updateMovie = async (req, res) => {
  //#swagger.tags = ['Movies']
  //#swagger.summary = 'Updates a movie by ID.'
  const { id } = req.params;
  try {
    const result = await Movie.findByIdAndUpdate(
      id,
      {
        title: req.body.title,
        director: req.body.director,
        language: req.body.language,
        year: req.body.year,
        genre: req.body.genre,
        synopsis: req.body.synopsis,
      },
      { new: true },
    );
    if (!result) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json(result);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: 'A movie with the same title already exists' });
    }
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ error: 'Validation failed', details: validationErrors });
    }
    return res.status(500).json({ error: 'Failed to update movie' });
  }
};

const deleteMovie = async (req, res) => {
  //#swagger.tags = ['Movies']
  //#swagger.summary = 'Deletes a movie by ID.'
  const { id } = req.params;
  try {
    const result = await Movie.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete movie' });
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
