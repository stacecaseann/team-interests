const { default: mongoose } = require('mongoose');
const Speaker = require('../schemas/SpeakerSchema');

const getAllSpeakers = async (req, res) => {
  try {
    const result = await Speaker.find();
    if (result.length === 0) {
      return res.status(404).json({ error: 'Your speakers were not found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'There was an error while getting your speaker' });
  }
};

const getSpeaker = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Speaker.findById(id);
    if (!result) {
      return res.status(404).json({ error: 'Your speaker was not found' });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'There was an error while getting your speaker' });
  }
};

const createSpeaker = async (req, res) => {
  try {
    const result = new Speaker({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: req.body.age,
      birthYear: req.body.birthYear,
      quote: req.body.quote,
    });
    await result.save();
    return res.status(201).json(result);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ error: 'ValidationError', details: message });
    }
    return res
      .status(500)
      .json({ error: 'There was an error while creating your speaker' });
  }
};

const updateSpeaker = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'You passed in an invalid ID' });
  }
  try {
    const result = await Speaker.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    if (!result) {
      return res.status(404).json({ error: 'Your speaker was not found' });
    }

    return res.status(200).json(result);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ error: 'ValidationError', details: message });
    }
    return res
      .status(500)
      .json({ error: 'There was an error while updating your speaker' });
  }
};

const deleteSpeaker = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'You passed in an invalid ID' });
  }
  try {
    const result = await Speaker.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Your speaker was not found' });
    }
    return res
      .status(200)
      .json({ message: 'Your speaker was deleted', speaker: result });
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'There was an error while deleting your speaker' });
  }
};

module.exports = {
  getAllSpeakers,
  getSpeaker,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
};
