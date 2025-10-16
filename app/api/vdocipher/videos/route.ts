import { NextResponse } from 'next/server';

const VDOCIPHER_API_SECRET = process.env.VDOCIPHER_API_SECRET;

export async function GET() {
  try {
    if (!VDOCIPHER_API_SECRET) {
      return NextResponse.json(
        { error: 'VdoCipher API credentials not configured' },
        { status: 500 }
      );
    }

    // Fetch videos from VdoCipher API
    const response = await fetch(
      'https://dev.vdocipher.com/api/videos',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Apisecret ${VDOCIPHER_API_SECRET}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Failed to fetch videos', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('VdoCipher videos fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
