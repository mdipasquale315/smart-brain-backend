const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = new ClarifaiStub();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key eaab5da8171941a28ce2fd286d8954ce"); // replace with your actual API key

// Function for face detection
const handleApiCall = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: 'No input image URL provided' });
    }

    const response = await new Promise((resolve, reject) => {
      stub.PostModelOutputs(
        {
          model_id: "a403429f2ddf4b49b307e318f00e528b",
          inputs: [{ data: { image: { url: input } } }]
        },
        metadata,
        (err, response) => {
          if (err) reject(err);
          else resolve(response);
        }
      );
    });

    if (response.status.code !== 10000) {
      console.error('Clarifai API error:', response.status.description);
      return res.status(500).json({ error: 'Clarifai API error', details: response.status.description });
    }

    // Send back face detection data
    res.json(response);
  } catch (error) {
    console.error('Error in handleApiCall:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

// Function for updating user entries
const handleImage = async (req, res) => {
  const { id } = req.body; // user id
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json('User not found');
    user.entries++;
    await user.save();
    res.json(user.entries);
  } catch (err) {
    res.status(400).json('Unable to get entries');
  }
};

module.exports = {
  handleApiCall,
  handleImage
};
