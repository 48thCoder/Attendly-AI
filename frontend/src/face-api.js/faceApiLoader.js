import * as faceapi from 'face-api.js';

export const loadModels = async () => {
  const MODEL_URL = '/models';

  try {
    if (faceapi.tf) {
      await faceapi.tf.setBackend('webgl');
      await faceapi.tf.ready();
    }

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  } catch (error) {
    throw error;
  }
};
