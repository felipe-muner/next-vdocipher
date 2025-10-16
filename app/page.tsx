'use client';

import { useState, useEffect } from 'react';
import VideoUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';

interface VdoCipherVideo {
  id: string;
  title: string;
  status: string;
  length: number;
  upload_time: number;
}

interface VideosResponse {
  rows: VdoCipherVideo[];
}

export default function Home() {
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [testVideoId, setTestVideoId] = useState<string>('');
  const [videos, setVideos] = useState<VdoCipherVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);
        const response = await fetch('/api/vdocipher/videos');

        if (response.ok) {
          const data: VideosResponse = await response.json();
          setVideos(data.rows || []);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
      } finally {
        setLoadingVideos(false);
      }
    };

    fetchVideos();
  }, []);

  const handleUploadSuccess = (videoId: string) => {
    setCurrentVideoId(videoId);
  };

  const handleTestVideo = () => {
    if (testVideoId.trim()) {
      setCurrentVideoId(testVideoId.trim());
    }
  };

  const handleVideoClick = (videoId: string) => {
    setCurrentVideoId(videoId);
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

        {/* Video List */}
        <div className="mb-12 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Your Videos
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Click on any video below to play it.
            </p>

            {loadingVideos ? (
              <div className="flex justify-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No videos found. Upload a video to get started!
              </div>
            ) : (
              <div className="space-y-2">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => handleVideoClick(video.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:border-blue-500 hover:bg-blue-50 ${
                      currentVideoId === video.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {video.title || 'Untitled Video'}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 font-mono truncate">
                          ID: {video.id}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>
                            Uploaded: {new Date(video.upload_time * 1000).toLocaleDateString()}
                          </span>
                          <span className="capitalize">
                            Status: <span className={`font-semibold ${
                              video.status === 'ready' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {video.status}
                            </span>
                          </span>
                        </div>
                      </div>
                      {currentVideoId === video.id && (
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Playing
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
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
