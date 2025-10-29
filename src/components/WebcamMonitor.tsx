import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, AlertTriangle, Download } from 'lucide-react';

interface WebcamMonitorProps {
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
  isRecording?: boolean;
  onPhotoCapture?: (photoBlob: Blob) => void;
}

const WebcamMonitor: React.FC<WebcamMonitorProps> = ({ 
  onPermissionGranted, 
  onPermissionDenied,
  isRecording = false,
  onPhotoCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);

  const startWebcam = async () => {
    setIsLoading(true);
    setError('');

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
      setIsPermissionGranted(true);
      setRecordingStartTime(Date.now());
      onPermissionGranted();

      // Start automatic photo capture every 30 seconds during exam
      if (isRecording) {
        startPhotoCapture();
      }
    } catch (err: any) {
      console.error('Webcam access error:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access to continue with the exam.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please connect a camera to continue with the exam.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another application. Please close other applications and try again.');
      } else {
        setError('Unable to access camera. Please check your camera settings and try again.');
      }
      
      onPermissionDenied();
    } finally {
      setIsLoading(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const photoUrl = URL.createObjectURL(blob);
            setPhotos(prev => [...prev, photoUrl]);
            
            if (onPhotoCapture) {
              onPhotoCapture(blob);
            }
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const startPhotoCapture = () => {
    // Capture photo immediately
    setTimeout(() => capturePhoto(), 2000);
    
    // Then capture every 30 seconds
    const interval = setInterval(() => {
      if (isRecording && isPermissionGranted) {
        capturePhoto();
      } else {
        clearInterval(interval);
      }
    }, 30000);

    return () => clearInterval(interval);
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsPermissionGranted(false);
    setRecordingStartTime(null);
  };

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const formatRecordingTime = () => {
    if (!recordingStartTime) return '00:00';
    const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Camera className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Camera Verification Required
        </h3>
        {isRecording ? (
          <p className="text-gray-600">
            Camera monitoring is active. Photos are being captured automatically for security.
          </p>
        ) : (
          <p className="text-gray-600">
            For exam security, we need to verify your camera is working properly.
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-red-800 font-medium mb-1">Camera Access Error</h4>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-6" style={{ aspectRatio: '4/3' }}>
        <canvas ref={canvasRef} className="hidden" />
        {isPermissionGranted ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <CameraOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Camera preview will appear here</p>
            </div>
          </div>
        )}
        
        {isPermissionGranted && (
          <div className="absolute top-4 right-4">
            <div className="bg-red-500 text-white px-3 py-1 rounded text-xs font-medium flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>REC {isRecording ? formatRecordingTime() : ''}</span>
            </div>
          </div>
        )}
        
        {isPermissionGranted && !isRecording && (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={capturePhoto}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              title="Capture Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Photo Gallery */}
      {photos.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Captured Photos ({photos.length})
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {photos.slice(-8).map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`Capture ${index + 1}`}
                  className="w-full h-16 object-cover rounded border"
                />
                <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                  {photos.length - 8 + index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {!isPermissionGranted ? (
          <button
            onClick={startWebcam}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Accessing Camera...</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>Enable Camera</span>
              </>
            )}
          </button>
        ) : (
          <div className="text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center space-x-2 text-green-800">
                <Camera className="w-5 h-5" />
                <span className="font-medium">
                  Camera is working properly! {isRecording ? 'Recording in progress...' : ''}
                </span>
              </div>
            </div>
            {isRecording ? (
              <p className="text-sm text-gray-600 mb-4">
                Photos are being captured automatically every 30 seconds for security monitoring.
              </p>
            ) : (
              <p className="text-sm text-gray-600 mb-4">
                Your camera will continue recording during the exam for security purposes.
              </p>
            )}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="text-yellow-800 font-medium mb-1">Important Notice</h4>
              <ul className="text-yellow-700 space-y-1">
                <li>• Photos are captured automatically during the exam</li>
                <li>• Ensure good lighting and clear visibility</li>
                <li>• Do not cover or disable your camera</li>
                <li>• Suspicious activity will be automatically detected</li>
                <li>• All photos are securely stored and encrypted</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamMonitor;