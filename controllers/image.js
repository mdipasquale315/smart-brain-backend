import Clarifai from 'clarifai';
import fetch from 'node-fetch';

// Initialize Clarifai app with your API key
const app = new Clarifai.App({
  apiKey: 'bb140ae5c13c4566bba41419915002f4'
});

const handleApiCall = (req, res) => {
  // Call Clarifai's face detection model
  app.models.predict('face-detection', req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'));
};

export { handleImage, handleApiCall };
