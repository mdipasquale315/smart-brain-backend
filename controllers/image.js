const clarifai = require('@clarifai/grpc');

// Set up the Clarifai gRPC client
const { ClarifaiStub, grpc } = clarifai;

const stub = new ClarifaiStub();

/**
 * Call Clarifai face detection model via gRPC
 * @param {string} imageUrl - URL of the image
 */
function predictFaceDetection(imageUrl) {
  stub.PostModelOutputs(
    {
      user_app_id: {
        user_id: '9d971wpgvajg', // replace with your user ID
        app_id: 'face-detection'     // replace with your app ID
      },
      model_id: 'face-detection',
      version_id: '6dc7e46bc9124c5c8824be4822abe105', // specific version
      inputs: [
        {
          data: {
            image: {
              url: imageUrl
            }
          }
        }
      ]
    },
    // callback function
    (err, response) => {
      if (err) {
        console.error('Error: ', err);
        return;
      }
      if (response.status.code !== 10000) {
        console.error('Failed response: ', response.status.description);
        return;
      }
      console.log('Face detection result:', response);
    }
  );
}

// Example usage
predictFaceDetection('https://samples.clarifai.com/metro-north.jpg');
