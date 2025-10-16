'use client';

import { useState } from 'react';
import VideoUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';

export default function Home() {
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [testVideoId, setTestVideoId] = useState<string>('');

  const handleUploadSuccess = (videoId: string) => {
    setCurrentVideoId(videoId);
  };

  const handleTestVideo = () => {
    if (testVideoId.trim()) {
      setCurrentVideoId(testVideoId.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            VdoCipher DRM Protected Video Platform
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload and play videos with enterprise-grade DRM protection, including screen recording blackout,
            dynamic watermarking, and multi-DRM encryption.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-12">
          <VideoUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Test with Existing Video ID */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Test with Existing Video ID
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              If you already have a video ID from VdoCipher, enter it below to test playback.
            </p>
            <div className="flex gap-4">
              <input
                type="text"
                value={testVideoId}
                onChange={(e) => setTestVideoId(e.target.value)}
                placeholder="Enter video ID (e.g., 1234abcd5678efgh)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                onClick={handleTestVideo}
                disabled={!testVideoId.trim()}
                className="bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Load Video
              </button>
            </div>
          </div>
        </div>

        {/* Player Section */}
        {currentVideoId && (
          <div className="mb-12 animate-fade-in">
            <VideoPlayer videoId={currentVideoId} />
          </div>
        )}
      </div>
    </div>
  );
}
