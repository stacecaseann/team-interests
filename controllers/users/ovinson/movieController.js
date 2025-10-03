const Movie = require('../../../schemas/MovieSchema');

const getMovies = async (req, res) => {
  //#swagger.tags = ['Movies']
  //#swagger.description = 'Endpoint to get all movies.'
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
  //#swagger.description = 'Endpoint to get a movie by its ID.'
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
  //#swagger.description = 'Endpoint to create a new movie.'
  const newMovie = new Movie(req.body);
  try {
    const result = await newMovie.save();
    res.status(201).json(result);
  } catch (err) {
    // console.error('Error creating movie:', err.message);
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
  //#swagger.description = 'Endpoint to update a movie by its ID.'
  const { id } = req.params;
  const updates = req.body;
  try {
    const result = await Movie.findByIdAndUpdate(id, updates, { new: true });
    if (!result) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.status(200).json(result);
  } catch (err) {
    // console.error('Error updating movie:', err);
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
  //#swagger.description = 'Endpoint to delete a movie by its ID.'
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
