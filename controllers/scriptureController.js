const Scripture = require('../schemas/ScriptureSchema');

const getAllScriptures = async (req, res) => {
  //#swagger.tags = ["Scriptures"]
  //#swagger.summary = "Gets a list of scriptures"
  try {
    const result = await Scripture.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving scripture list' });
  }
};

const getScriptureById = async (req, res) => {
  //#swagger.tags = ["Scriptures"]
  //#swagger.summary = "Gets a scripture by ID"
  const { id } = req.params;
  try {
    const result = await Scripture.findById(id);
    if (!result) {
      return res.status(404).json({ error: 'Scripture not found' });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Error retrieving scripture' });
  }
};

const addScripture = async (req, res) => {
  //#swagger.tags = ["Scriptures"]
  //#swagger.summary = "Creates a scripture"
  try {
    const result = new Scripture({
      book: req.body.book,
      chapter: req.body.chapter,
      verse: req.body.verse,
      text: req.body.text,
    });
    await result.save;
    return res.status(201).json(result);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ error: 'ValidationError', details: message });
    }
    return res.status(500).json({ error: 'Error creating scripture' });
  }
};

const updateScripture = async (req, res) => {
  //#swagger.tags = ["Scriptures"]
  //#swagger.summary = "Updates a scripture"
  const { id } = req.params;
  try {
    const result = await Scripture.findByIdAndUpdate(
      id,
      {
        book: req.body.book,
        chapter: req.body.chapter,
        verse: req.body.verse,
        text: req.body.text,
      },
      { new: true, runValidators: true },
    );
    if (!result) {
      return res.status(404).json({ error: 'Scripture not found' });
    }
    return res.status(204).json(result);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ error: 'ValidationError', details: message });
    }
    return res.status(500).json({ error: 'Error updating scripture' });
  }
};

const deleteScripture = async (req, res) => {
  //#swagger.tags = ["Scriptures"]
  //#swagger.summary = "Deletes a scripture"
  const { id } = req.params;
  try {
    const result = await Scripture.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Scripture not found' });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Error retrieving scripture' });
  }
};

module.exports = {
  getAllScriptures,
  getScriptureById,
  addScripture,
  updateScripture,
  deleteScripture,
};
