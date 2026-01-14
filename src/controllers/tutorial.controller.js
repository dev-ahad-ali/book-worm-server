import Tutorial from '../models/tutorial.model.js';

export const createTutorial = async (req, res) => {
  try {
    const { title, youtubeUrl, description } = req.body;

    if (!title || !youtubeUrl) {
      return res.status(400).json({ message: 'Title and YouTube URL are required' });
    }

    const tutorial = await Tutorial.create({
      title,
      youtubeUrl,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(tutorial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    res.json(tutorial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndDelete(req.params.id);

    if (!tutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    res.json({ message: 'Tutorial deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({ createdAt: -1 }).populate('createdBy', 'name');

    res.json(tutorials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
