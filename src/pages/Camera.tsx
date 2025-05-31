
import React, { useRef, useState, useCallback } from 'react';
import { Camera as CameraIcon, RotateCcw, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import { useNavigate } from 'react-router-dom';

const Camera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsStreaming(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const downloadImage = useCallback(() => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.download = `photo-${Date.now()}.jpg`;
      link.href = capturedImage;
      link.click();
    }
  }, [capturedImage]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation />
      <div className="pt-16 pb-20 md:pb-8">
        <div className="max-w-md mx-auto px-4 py-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold">Camera</h1>
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {!capturedImage ? (
                <>
                  <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  <div className="flex justify-center space-x-4">
                    {!isStreaming ? (
                      <Button onClick={startCamera} className="flex-1">
                        <CameraIcon className="w-4 h-4 mr-2" />
                        Start Camera
                      </Button>
                    ) : (
                      <Button onClick={capturePhoto} className="flex-1">
                        <CameraIcon className="w-4 h-4 mr-2" />
                        Capture Photo
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={retakePhoto} variant="outline" className="flex-1">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retake
                    </Button>
                    <Button onClick={downloadImage} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Camera;
