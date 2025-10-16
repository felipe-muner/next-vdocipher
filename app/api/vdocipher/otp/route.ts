import { NextRequest, NextResponse } from 'next/server';

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
    // Relies on dashboard domain whitelist configuration
    const response = await fetch(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Apisecret ${VDOCIPHER_API_SECRET}`,
        },
        body: JSON.stringify({
          ttl: 300, // 5 minutes validity
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Failed to generate OTP', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('VdoCipher OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
