import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

const VDOCIPHER_API_SECRET = process.env.VDOCIPHER_API_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!VDOCIPHER_API_SECRET) {
      return NextResponse.json(
        { error: 'VdoCipher API Secret not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Step 1: Get upload credentials from VdoCipher
    const credentialsResponse = await axios.put(
      'https://dev.vdocipher.com/api/videos',
      {},
      {
        params: {
          title: title || file.name,
        },
        headers: {
          Authorization: `Apisecret ${VDOCIPHER_API_SECRET}`,
        },
      }
    );

    const { videoId, clientPayload } = credentialsResponse.data;
    const {
      uploadLink,
      policy,
      key,
      'x-amz-signature': xAmzSignature,
      'x-amz-algorithm': xAmzAlgorithm,
      'x-amz-credential': xAmzCredential,
      'x-amz-date': xAmzDate
    } = clientPayload;

    // Step 2: Upload the video file to VdoCipher
    const uploadFormData = new FormData();

    // Add all AWS signature fields (order matters!)
    uploadFormData.append('policy', policy);
    uploadFormData.append('key', key);
    uploadFormData.append('x-amz-signature', xAmzSignature);
    uploadFormData.append('x-amz-algorithm', xAmzAlgorithm);
    uploadFormData.append('x-amz-credential', xAmzCredential);
    uploadFormData.append('x-amz-date', xAmzDate);
    uploadFormData.append('success_action_status', '201');
    uploadFormData.append('success_action_redirect', '');

    // Convert File to Buffer for form-data
    const buffer = Buffer.from(await file.arrayBuffer());
    uploadFormData.append('file', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    // Upload to VdoCipher
    await axios.post(uploadLink, uploadFormData, {
      headers: {
        ...uploadFormData.getHeaders(),
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return NextResponse.json({
      success: true,
      videoId,
      message: 'Video uploaded successfully',
    });
  } catch (error) {
    console.error('VdoCipher upload error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        {
          error: 'Upload failed',
          details: error.response?.data || error.message
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Upload failed', details: String(error) },
      { status: 500 }
    );
  }
}
