import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconSvg = `
<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="100" fill="#09090b"/>
  <!-- Inner card badge -->
  <rect x="36" y="80" width="440" height="352" rx="36" fill="#ffffff" />
  
  <!-- Monogram FB & Ferreteria Bruzzone -->
  <g transform="translate(60, 160) scale(0.75)">
    <!-- Top blue bar and upper B curve -->
    <path
      d="M 6 12 H 115 C 135 12, 148 22, 148 36 C 148 48, 137 56, 120 58 C 140 60, 150 70, 150 84 C 150 98, 135 104, 115 104 H 70 V 92 H 114 C 127 92, 137 88, 137 81 C 137 74, 127 70, 114 70 H 92 V 58 H 114 C 126 58, 135 54, 135 47 C 135 40, 126 36, 114 36 H 45 V 24 H 6 Z"
      fill="#2b7a9e"
    />
    <!-- Bolt dot -->
    <circle cx="14" cy="48" r="8" fill="#1a1a1a" />
    <!-- Lower F stem -->
    <path
      d="M 6 64 H 45 V 76 H 18 V 104 H 6 Z"
      fill="#1a1a1a"
    />
    <rect x="25" y="64" width="40" height="12" fill="#1a1a1a" />

    <!-- Text: FERRETERIA -->
    <text
      x="165"
      y="42"
      fill="#2b7a9e"
      font-family="'Plus Jakarta Sans', system-ui, sans-serif"
      font-weight="800"
      font-size="36"
      letter-spacing="2.5"
    >
      FERRETERIA
    </text>

    <!-- Text: BRUZZONE -->
    <text
      x="165"
      y="88"
      fill="#1a1a1a"
      font-family="'Plus Jakarta Sans', system-ui, sans-serif"
      font-weight="900"
      font-size="48"
      letter-spacing="3"
    >
      BRUZZONE
    </text>
  </g>
</svg>
`;

const maskableSvg = `
<svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid background extending 100% for maskable safe zone -->
  <rect width="512" height="512" fill="#09090b"/>
  
  <!-- Safe zone centered content (within central 80%) -->
  <g transform="translate(56, 56) scale(0.78)">
    <rect x="10" y="80" width="490" height="352" rx="36" fill="#ffffff" />
    
    <g transform="translate(45, 175) scale(0.8)">
      <path
        d="M 6 12 H 115 C 135 12, 148 22, 148 36 C 148 48, 137 56, 120 58 C 140 60, 150 70, 150 84 C 150 98, 135 104, 115 104 H 70 V 92 H 114 C 127 92, 137 88, 137 81 C 137 74, 127 70, 114 70 H 92 V 58 H 114 C 126 58, 135 54, 135 47 C 135 40, 126 36, 114 36 H 45 V 24 H 6 Z"
        fill="#2b7a9e"
      />
      <circle cx="14" cy="48" r="8" fill="#1a1a1a" />
      <path
        d="M 6 64 H 45 V 76 H 18 V 104 H 6 Z"
        fill="#1a1a1a"
      />
      <rect x="25" y="64" width="40" height="12" fill="#1a1a1a" />

      <text
        x="165"
        y="42"
        fill="#2b7a9e"
        font-family="'Plus Jakarta Sans', system-ui, sans-serif"
        font-weight="800"
        font-size="36"
        letter-spacing="2.5"
      >
        FERRETERIA
      </text>

      <text
        x="165"
        y="88"
        fill="#1a1a1a"
        font-family="'Plus Jakarta Sans', system-ui, sans-serif"
        font-weight="900"
        font-size="48"
        letter-spacing="3"
      >
        BRUZZONE
      </text>
    </g>
  </g>
</svg>
`;

async function main() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 192x192
  await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // Maskable 512x512
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Apple touch icon 180x180
  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('PWA icons successfully generated in /public!');
}

main().catch(console.error);
