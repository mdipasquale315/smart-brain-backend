const handleApiCall = (req, res) => {
    const APP_ID = 'face-detection';
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
    const IMAGE_URL = req.body.input;
    const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
    const stub = ClarifaiStub.grpc();
    
    // This will be used by every Clarifai endpoint call
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Key " + process.env.CLARIFAI_API_KEY); // Use environment variable
    
    stub.postModelOutputs(  // Changed from PostModelOutputs to postModelOutputs
        {
            user_app_id: {
                "user_id": '9d971wpgvajg',  // Removed extra comma
                "app_id": 'face-detection'
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID,
            inputs: [
                { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.error("Clarifai API Error:", err);
                return res.status(400).json("Error calling Clarifai API");
            }
            if (response.status.code !== 10000) {
                console.error("Clarifai Response Error:", response.status.description);
                return res.status(400).json("Post model outputs failed: " + response.status.description);
            }
            
            const output = response.outputs[0];
            return res.json(output);
        }
    );
}

const handleImage = (req, res, db) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json("Invalid Form Submission...!");
    }
    db('users').where({ id })
        .returning('entries')
        .increment('entries', 1)
        .then(entries => {
            (entries.length) ? res.json(entries[0].entries)
                : res.status(400).json("Entry not found...!");
        })
        .catch(err => res.status(400).json("Error updating entries..."));
}

module.exports = {
    handleImage,
    handleApiCall  // Changed from clarifaiRequest
}
