'use client';

import { useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoId: string;
  onError?: (error: string) => void;
}

interface OTPResponse {
  otp: string;
  playbackInfo: string;
}

export default function VideoPlayer({ videoId, onError }: VideoPlayerProps) {
  const [otpData, setOtpData] = useState<OTPResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string>('');
  const [checkingStatus, setCheckingStatus] = useState(false);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Check video status first
        const statusResponse = await fetch('/api/vdocipher/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId }),
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to get video status');
        }

        const statusData = await statusResponse.json();
        const status = statusData.status?.toLowerCase() || '';
        setVideoStatus(status);

        // Step 2: Only get OTP if video is ready
        if (status !== 'ready') {
          setLoading(false);
          return;
        }

        // Step 3: Fetch OTP and playback info from our API
        const response = await fetch('/api/vdocipher/otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ videoId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to get playback credentials');
        }

        const data = await response.json();

        if (!data.otp || !data.playbackInfo) {
          throw new Error('Invalid playback credentials');
        }

        setOtpData(data);
        setLoading(false);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load video';
        setError(errorMsg);
        onError?.(errorMsg);
        setLoading(false);
      }
    };

    if (videoId) {
      initializePlayer();
    }
  }, [videoId, onError]);

  const loadPlayer = async () => {
    try {
      setLoading(true);

      // Fetch OTP and playback info from our API
      const response = await fetch('/api/vdocipher/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get playback credentials');
      }

      const data = await response.json();

      if (!data.otp || !data.playbackInfo) {
        throw new Error('Invalid playback credentials');
      }

      setOtpData(data);
      setLoading(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load video';
      setError(errorMsg);
      onError?.(errorMsg);
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    setCheckingStatus(true);
    try {
      const statusResponse = await fetch('/api/vdocipher/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        const status = statusData.status?.toLowerCase() || '';
        setVideoStatus(status);

        if (status === 'ready') {
          // Load the player
          await loadPlayer();
        }
      }
    } catch (err) {
      console.error('Status check failed:', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error Loading Video
          </h3>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const getStatusMessage = () => {
    switch (videoStatus) {
      case 'pre-upload':
        return {
          type: 'warning',
          title: 'Video Not Uploaded',
          message: 'The video upload is not complete yet.',
        };
      case 'queued':
        return {
          type: 'info',
          title: 'Video Processing',
          message: 'Your video is being encoded and encrypted. This usually takes 2-5 minutes. Please check back shortly.',
        };
      case 'ready':
        return null;
      default:
        return {
          type: 'info',
          title: 'Checking Status',
          message: 'Checking video status...',
        };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        DRM Protected Video Player
      </h2>

      {statusMessage && (
        <div className={`p-4 mb-6 rounded-lg border ${
          statusMessage.type === 'warning'
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-2 ${
            statusMessage.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
          }`}>
            {statusMessage.title}
          </h3>
          <p className={`text-sm mb-4 ${
            statusMessage.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
          }`}>
            {statusMessage.message}
          </p>
          <button
            onClick={checkStatus}
            disabled={checkingStatus}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            {checkingStatus ? 'Checking...' : 'Check Status Again'}
          </button>
        </div>
      )}

      {loading && !statusMessage && (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading video player...</p>
          </div>
        </div>
      )}

      {otpData && videoStatus === 'ready' && (
        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
          <iframe
            src={`https://player.vdocipher.com/v2/?otp=${otpData.otp}&playbackInfo=${otpData.playbackInfo}`}
            style={{
              border: 0,
              maxWidth: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
            }}
            className="rounded-lg"
            allowFullScreen
            allow="encrypted-media"
          />
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">
          DRM Protection Features:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Screen recording protection (blackout on recordings)</li>
          <li>Dynamic watermarking</li>
          <li>Geo-blocking and domain restrictions</li>
          <li>Encryption with multi-DRM support</li>
        </ul>
      </div>
    </div>
  );
}
