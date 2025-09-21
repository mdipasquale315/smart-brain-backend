const express = require('express');
const cors = require('cors');
const { ClarifaiStub, grpc } = require('clarifai-nodejs-grpc');

const app = express();

// CORS setup: Allow only your frontend domain
app.use(cors({
  origin: 'https://smart-brain-frontend-7xlb.onrender.com'
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Clarifai setup
const stub = new ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key b27bf519c2414f5aabffbe6e5a532bf1");"); // <-- Replace with your Clarifai API key

// Route: Handle image URL for Clarifai face detection
app.post('/imageurl', (req, res) => {
  const { input } = req.body; // Expecting { input: 'image_url_here' }

  if (!input) {
    return res.status(400).json('No image URL provided');
  }

  stub.PostModelOutputs(
    {
      model_id: "a403429f2ddf4b49b307e318f00e528b", // Face detection model
      inputs: [{ data: { image: { url: input } } }]
    },
    metadata,
    (err, response) => {
      if (err) {
        console.error('Clarifai API error:', err);
        return res.status(500).json('Unable to work with API');
      }

      if (response.status.code !== 10000) {
        console.error('Clarifai response status:', response.status.description);
        return res.status(500).json('Error from Clarifai API');
      }

      // Send response back to frontend
      res.json(response);
    }
  );
});

// Route: Handle user signin (example, based on your existing code)
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  // Your signin logic here (e.g., check database)
  // For demonstration, send success response
  res.json('Signed in successfully');
});

// Route: Handle user registration
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  // Your registration logic here
  res.json('User registered');
});

// Route: Update user entries count
app.put('/image', (req, res) => {
  const { id } = req.body;
  // Your database logic to update entries
  res.json('Entries updated');
});

// Server listening
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
