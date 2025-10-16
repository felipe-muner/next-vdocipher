import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const VDOCIPHER_API_SECRET = process.env.VDOCIPHER_API_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!VDOCIPHER_API_SECRET) {
      return NextResponse.json(
        { error: 'VdoCipher API credentials not configured' },
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

    // Get OTP from VdoCipher API
    // Allow empty origin for localhost development (player detects origin as "none")
    const response = await axios.post(
      'https://dev.vdocipher.com/api/videos/' + videoId + '/otp',
      {
        ttl: 300,
        whitelisthref: '(localhost|none)',
      },
      {
        headers: {
          Authorization: `Apisecret ${VDOCIPHER_API_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const { otp, playbackInfo } = response.data;

    return NextResponse.json({
      success: true,
      otp,
      playbackInfo,
    });
  } catch (error) {
    console.error('VdoCipher OTP error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: 'Failed to get OTP',
          details: error.response?.data || error.message
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get OTP', details: String(error) },
      { status: 500 }
    );
  }
}
