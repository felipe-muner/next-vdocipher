import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const VDOCIPHER_API_SECRET = process.env.VDOCIPHER_API_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!VDOCIPHER_API_SECRET) {
      return NextResponse.json(
        { error: 'VdoCipher API Secret not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { videoId } = body;

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Get video details from VdoCipher API
    const response = await axios.get(
      `https://dev.vdocipher.com/api/videos/${videoId}`,
      {
        headers: {
          Authorization: `Apisecret ${VDOCIPHER_API_SECRET}`,
        },
      }
    );

    const videoData = response.data;

    return NextResponse.json({
      success: true,
      status: videoData.status,
      title: videoData.title,
      length: videoData.length,
      uploadTime: videoData.upload_time,
    });
  } catch (error) {
    console.error('VdoCipher status error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: 'Failed to get video status',
          details: error.response?.data || error.message
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get video status', details: String(error) },
      { status: 500 }
    );
  }
}
