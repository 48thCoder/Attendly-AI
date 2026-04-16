import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { loadModels } from './faceApiLoader';
import { Camera, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const FaceScanner = ({ onMatchFound, isScanning, onModelsLoaded }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        await loadModels();
        setModelsLoaded(true);
        if (onModelsLoaded) onModelsLoaded();
      } catch (err) {
        setError('Failed to load face detection models.');
        toast.error('Face detection models failed to load.');
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (modelsLoaded && isScanning) {
      startVideo();
    } else {
      stopVideo();
    }
    return () => stopVideo();
  }, [modelsLoaded, isScanning]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Webcam access was denied or is unavailable.');
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const isProcessingRef = useRef(false);

  const handleVideoPlay = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const displaySize = { 
      width: videoRef.current.videoWidth, 
      height: videoRef.current.videoHeight 
    };
    
    faceapi.matchDimensions(canvasRef.current, displaySize);

    let isInterrupted = false;

    const processFrame = async () => {
      if (isInterrupted || !isScanning || !videoRef.current) return;

      try {
        const detection = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (videoRef.current && canvasRef.current && !isInterrupted) {
          const context = canvasRef.current.getContext('2d');
          context.clearRect(0, 0, displaySize.width, displaySize.height);

          if (detection) {
            const resizedDetection = faceapi.resizeResults(detection, displaySize);
            faceapi.draw.drawDetections(canvasRef.current, resizedDetection);
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetection);

            if (!isProcessingRef.current) {
              isProcessingRef.current = true;
              onMatchFound([detection]);
              setTimeout(() => { isProcessingRef.current = false; }, 3500);
            }
          }
        }
      } catch (err) {
      }

      setTimeout(() => {
        requestAnimationFrame(processFrame);
      }, 400);
    };

    processFrame();

    return () => {
      isInterrupted = true;
    };
  };

  return (
    <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden group">
      {!modelsLoaded ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-50">
          <RefreshCw size={32} className="text-primary animate-spin mb-4" />
          <p className="text-gray-400 text-sm animate-pulse">Initializing AI Neural Engine...</p>
        </div>
      ) : null}

      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 z-50 p-6 text-center">
          <div className="bg-red-500/10 p-4 rounded-full mb-4">
            <Camera size={32} className="text-red-500" />
          </div>
          <p className="text-red-400 font-semibold mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs text-primary hover:underline"
          >
            Click to refresh and try again
          </button>
        </div>
      ) : null}

      <video
        ref={videoRef}
        autoPlay
        muted
        onPlay={handleVideoPlay}
        className="w-full h-full object-cover mirror"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      
      {!isScanning && modelsLoaded && (
        <div className="absolute inset-0 bg-background/60 flex items-center justify-center p-8 text-center backdrop-blur-[2px]">
          <div>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Camera size={24} className="text-primary opacity-50" />
            </div>
            <p className="text-sm text-gray-400 max-w-[200px]">Click "Start Recognition" to activate camera</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceScanner;
