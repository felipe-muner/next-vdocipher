'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';

interface UploadResponse {
  success: boolean;
  videoId: string;
  message: string;
}

interface VideoUploadProps {
  onUploadSuccess?: (videoId: string) => void;
}

export default function VideoUpload({ onUploadSuccess }: VideoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideoId, setUploadedVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setError(null);
      setUploadedVideoId(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title);

      // Simulate progress (since we can't track actual upload progress easily)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/vdocipher/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data: UploadResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setUploadedVideoId(data.videoId);
      onUploadSuccess?.(data.videoId);

      // Reset form
      setSelectedFile(null);
      setTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Upload Video to VdoCipher
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Video Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter video title"
            disabled={uploading}
          />
        </div>

        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Video File
          </label>
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={uploading}
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {selectedFile.name} (
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {uploadedVideoId && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Video uploaded successfully! Video ID: {uploadedVideoId}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
}
