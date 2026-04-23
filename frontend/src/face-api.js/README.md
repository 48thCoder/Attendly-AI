# Face-api.js Integration

This folder contains the facial recognition logic for Attendly AI.

## Files
- `FaceScanner.jsx`: The main component that handles webcam feed and face detection.
- `faceApiLoader.js`: Utility to load TensorFlow.js models.
- `index.js`: Entry point for imports.

## Setup Required
To make this work, you must place the following models in your `frontend/public/models` directory:
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`
- `ssd_mobilenetv1_model-weights_manifest.json`
- `ssd_mobilenetv1_model-shard1`

You can find these models in the official `face-api.js` repository or download them from a trusted source.
