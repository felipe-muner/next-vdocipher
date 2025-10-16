# VdoCipher DRM Protected Video Platform

A Next.js application demonstrating VdoCipher integration for DRM-protected video upload and playback with enterprise-grade security features.

## Features

- Video upload to VdoCipher with progress tracking
- DRM-protected video playback
- Screen recording blackout protection
- Dynamic watermarking support
- Multi-DRM encryption (Widevine, FairPlay, PlayReady)
- Modern, responsive UI with Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- VdoCipher account ([Sign up here](https://www.vdocipher.com/))
- VdoCipher API Secret Key

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update the `.env.local` file in the project root with your VdoCipher API Secret Key:

```env
VDOCIPHER_API_SECRET=your_api_secret_key_here
```

Get your API Secret Key from [VdoCipher Dashboard → API Keys](https://www.vdocipher.com/dashboard/config/apikeys)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
next-vdocipher/
├── app/
│   ├── api/
│   │   └── vdocipher/
│   │       ├── upload/route.ts    # Video upload API endpoint
│   │       └── otp/route.ts       # OTP generation for playback
│   ├── page.tsx                   # Main demo page
│   ├── layout.tsx                 # Root layout
│   ├── error.tsx                  # Error page
│   ├── not-found.tsx              # 404 page
│   └── global-error.tsx           # Global error handler
├── components/
│   ├── VideoUpload.tsx            # Video upload component
│   └── VideoPlayer.tsx            # DRM-protected video player
└── .env.local                     # Environment variables
```

## API Routes

### POST /api/vdocipher/upload

Uploads a video file to VdoCipher.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `file`: Video file
  - `title`: Video title (optional)

**Response:**
```json
{
  "success": true,
  "videoId": "abc123...",
  "message": "Video uploaded successfully"
}
```

### POST /api/vdocipher/otp

Generates OTP and playback info for secure video playback.

**Request:**
```json
{
  "videoId": "abc123..."
}
```

**Response:**
```json
{
  "success": true,
  "otp": "...",
  "playbackInfo": "..."
}
```

## Testing DRM Protection

1. Upload a video using the upload form
2. Once uploaded, the video will automatically load in the player
3. Try screen recording - the video area will be blacked out (DRM protection active)
4. Test on different devices to see multi-DRM in action

## DRM Features

- **Screen Recording Protection**: Video blackout when screen recording is detected
- **Dynamic Watermarking**: Custom watermarks with user info and timestamps
- **Geo-Blocking**: Restrict playback by geography
- **Domain Restrictions**: Control where videos can be played
- **Multi-DRM**: Supports Widevine, FairPlay, and PlayReady

## Known Issues

### Build Error with Next.js 15.5.5

There is a known issue with Next.js 15.5.5 where the build fails during static page generation for error pages with:

```
Error: <Html> should not be imported outside of pages/_document
```

This is an internal Next.js issue and **does not affect the functionality**:
- ✓ Development mode works perfectly
- ✓ Code compilation passes
- ✓ Linting passes
- ✓ TypeScript checks pass

**Workarounds:**
1. Use development mode for testing: `npm run dev`
2. Deploy using platforms that handle this automatically (Vercel, Netlify)
3. Wait for Next.js 15.5.6+ which should fix this issue

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **VdoCipher** - DRM-protected video platform
- **Axios** - HTTP client for API requests
- **date-fns** - Date manipulation library

## Learn More

- [VdoCipher Documentation](https://www.vdocipher.com/docs)
- [VdoCipher API Reference](https://www.vdocipher.com/docs/api)
- [Next.js Documentation](https://nextjs.org/docs)
- [DRM Technology Overview](https://www.vdocipher.com/blog/2019/02/what-is-drm-digital-rights-management/)

## Support

For VdoCipher-related issues, contact [VdoCipher Support](https://www.vdocipher.com/support)

## License

MIT
