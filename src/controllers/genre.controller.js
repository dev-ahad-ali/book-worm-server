import Genre from '../models/genre.model.js';

export const createGenre = async (req, res) => {
  const genre = await Genre.create(req.body);
  res.status(201).json(genre);
};

export const updateGenre = async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(genre);
};

export const getGenres = async (req, res) => {
  const genres = await Genre.find();
  res.json(genres);
};
