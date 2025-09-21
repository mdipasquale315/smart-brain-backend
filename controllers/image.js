const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = new ClarifaiStub();
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key eaab5da8171941a28ce2fd286d8954ce"); // <-- Replace with your actual API key

const handleApiCall = async (req, res) => {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: 'No input image URL provided' });
  }

  try {
    // Call Clarifai API
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
            console.log('Clarifai response:', response); // Log raw response for debugging
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
    // Send only the regions array (bounding boxes info)
    res.json({ faceBoxes: regions });
  } catch (error) {
    console.error('Error in handleApiCall:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};

module.exports = {
  handleApiCall
};
