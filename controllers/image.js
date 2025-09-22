const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

// Use your actual API key here
const API_KEY = "eaab5da8171941a28ce2fd286d8954ce";

// Initialize Clarifai stub
const stub = new ClarifaiStub();

// Set authorization metadata
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${API_KEY}`);

// Initialize total entries counter
let totalEntries = 0;

const handleApiCall = async (req, res) => {
  const { input } = req.body;

  // Validate input
  if (!input || typeof input !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing input image URL' });
  }

  try {
    const response = await new Promise((resolve, reject) => {
      stub.PostModelOutputs(
        {
          model_id: "a403429f2ddf4b49b307e318f00e528b",
          inputs: [{ data: { image: { url: input } } }]
        },
        metadata,
        (err, response) => {
          if (err) {
            console.error('Clarifai API error:', err);
            reject(err);
          } else {
            console.log('Clarifai response:', response);
            resolve(response);
          }
        }
      );
    });

    if (response.status.code !== 10000) {
      console.error('Clarifai API error:', response.status.description);
      return res.status(500).json({ error: 'Clarifai API error', details: response.status.description });
    }

    const regions = response.outputs[0]?.data?.regions || [];
    console.log('Detected regions:', regions);

    // Increment total entries if faces are detected
    if (regions.length > 0) {
      totalEntries++;
    }

    // Send face regions and total entries back
    res.json({ faceBoxes: regions, totalEntries });
  } catch (error) {
    console.error('Error in handleApiCall:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = {
  handleApiCall
};
