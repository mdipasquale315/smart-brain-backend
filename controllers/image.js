const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key b27bf519c2414f5aabffbe6e5a532bf1");

//const Clarifai = require('clarifai');

//You must add your own API key here from Clarifai. 
//const app = new Clarifai.App({
// apiKey: 'b27bf519c2414f5aabffbe6e5a532bf1' 
//});
const handleApiCall = (req, res) => {
stub.PostModelOutputs(
    {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: "a403429f2ddf4b49b307e318f00e528b",
        inputs: [{data: {image: {url: req.body.input}}}]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error: " + err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
            return;
        }

        console.log("Predicted concepts, with confidence values:")
        for (const c of response.outputs[0].data.concepts) {
            console.log(c.name + ": " + c.value);
        }
      res.json(response)
    }
);


  // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
  // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
  // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
  // If that isn't working, then that means you will have to wait until their servers are back up. 

 // app.models.predict('face-detection', req.body.input)
   // .then(data => {
   //   res.json(data);
 //   })
 //   .catch(err => res.status(400).json('unable to work with API'))
//}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
    // entries[0] --> this used to return the entries
    // TO
    // entries[0].entries --> this now returns the entries
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}
