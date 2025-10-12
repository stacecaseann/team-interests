const ProgrammingLanguage = require('../schemas/ProgrammingLanguageSchema');

const getLanguages = async (req, res) => {
  //#swagger.tags = ['ProgrammingLanguages']
  //#swagger.summary = 'Gets all programming languages.'
  try {
    const result = await ProgrammingLanguage.find();
    if (result.length === 0) {
      return res.status(404).json({ error: 'No programming languages found' });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Failed to fetch programming languages' });
  }
};

const getLanguageById = async (req, res) => {
  //#swagger.tags = ['ProgrammingLanguages']
  //#swagger.summary = 'Gets a programming language by ID.'
  const { id } = req.params;
  try {
    const result = await ProgrammingLanguage.findById(id);
    if (!result) {
      return res.status(404).json({ error: 'Programming language not found' });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Failed to fetch programming language' });
  }
};

// Create a new programming language
const createLanguage = async (req, res) => {
  /* #swagger.tags = ['ProgrammingLanguages']
     #swagger.summary = 'Creates a new programming language.'
     #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            name: "Python",
            paradigm: ["Object-Oriented", "Functional", "Imperative"],
            firstAppeared: 1991,
            creator: "Guido van Rossum",
            website: "https://python.org",
            description: "Python is a programming language that lets you work quickly."
        }
     }
  */
  try {
    const result = await ProgrammingLanguage.create({
      name: req.body.name,
      paradigm: req.body.paradigm,
      firstAppeared: req.body.firstAppeared,
      creator: req.body.creator,
      website: req.body.website,
      description: req.body.description,
    });
    return res.status(201).json(result);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'A programming language with this name already exists',
      });
    }
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ error: 'Validation failed', details: validationErrors });
    }
    return res.status(500).json({
      error: 'Failed to create programming language',
    });
  }
};

const updateLanguage = async (req, res) => {
  //#swagger.tags = ['ProgrammingLanguages']
  //#swagger.summary = 'Updates a programming language by ID.'
  const { id } = req.params;
  try {
    const result = await ProgrammingLanguage.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        paradigm: req.body.paradigm,
        firstAppeared: req.body.firstAppeared,
        creator: req.body.creator,
        website: req.body.website,
        description: req.body.description,
      },
      { new: true, runValidators: true },
    );
    if (!result) {
      return res.status(404).json({ error: 'Programming language not found' });
    }
    res.status(200).json(result);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'A programming language with the same name already exists',
      });
    }
    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ error: 'Validation failed', details: validationErrors });
    }
    return res
      .status(500)
      .json({ error: 'Failed to update programming language' });
  }
};

const deleteLanguage = async (req, res) => {
  //#swagger.tags = ['ProgrammingLanguages']
  //#swagger.summary = 'Deletes a programming language by ID.'
  const { id } = req.params;
  try {
    const result = await ProgrammingLanguage.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Programming language not found' });
    }
    return res.status(204).send();
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Failed to delete programming language' });
  }
};

module.exports = {
  getLanguages,
  getLanguageById,
  createLanguage,
  updateLanguage,
  deleteLanguage,
};
