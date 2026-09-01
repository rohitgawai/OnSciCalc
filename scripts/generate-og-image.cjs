const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a0a" />
      <stop offset="50%" stop-color="#111111" />
      <stop offset="100%" stop-color="#070707" />
    </linearGradient>

    <!-- Ambient Cyan Glow -->
    <radialGradient id="glow-cyan" cx="25%" cy="30%" r="45%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
    </radialGradient>

    <!-- Ambient Violet Glow -->
    <radialGradient id="glow-violet" cx="80%" cy="65%" r="50%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0" />
    </radialGradient>

    <!-- Border Linear Gradient -->
    <linearGradient id="card-border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.04" />
    </linearGradient>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Glows -->
  <rect width="1200" height="630" fill="url(#glow-cyan)" />
  <rect width="1200" height="630" fill="url(#glow-violet)" />

  <!-- Subtle Grid Pattern -->
  <g stroke="#ffffff" stroke-opacity="0.03" stroke-width="1">
    <line x1="100" y1="0" x2="100" y2="630" />
    <line x1="300" y1="0" x2="300" y2="630" />
    <line x1="500" y1="0" x2="500" y2="630" />
    <line x1="700" y1="0" x2="700" y2="630" />
    <line x1="900" y1="0" x2="900" y2="630" />
    <line x1="1100" y1="0" x2="1100" y2="630" />
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="250" x2="1200" y2="250" />
    <line x1="0" y1="400" x2="1200" y2="400" />
    <line x1="0" y1="550" x2="1200" y2="550" />
  </g>

  <!-- Main Card Container -->
  <rect x="80" y="70" width="1040" height="490" rx="28" fill="#141414" fill-opacity="0.7" stroke="url(#card-border)" stroke-width="1.5" />

  <!-- Top Logo & Brand Bar -->
  <g transform="translate(140, 140)">
    <!-- Brand Icon -->
    <rect width="52" height="52" rx="14" fill="#1f1f1f" stroke="#333333" stroke-width="1.5" />
    <path d="M14 38h24L26 14z" fill="#0070f3" fill-opacity="0.25" stroke="#0070f3" stroke-width="2.5" stroke-linejoin="round" />
    
    <!-- Brand Title -->
    <text x="68" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="700" fill="#ffffff" letter-spacing="-0.5">OnSciCalc<tspan fill="#0070f3">.</tspan></text>
    <text x="245" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" fill="#71717a">|  Free Online Scientific Calculator</text>
  </g>

  <!-- Main Headline -->
  <text x="140" y="275" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="800" fill="#ffffff" letter-spacing="-1.5">
    Next-Gen Scientific Calculator
  </text>
  
  <!-- Subtitle -->
  <text x="140" y="330" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="400" fill="#a1a1aa">
    Double precision, fractions, trigonometry, logarithms, keyboard shortcuts, and 10+ languages.
  </text>

  <!-- Badges / Feature Pills -->
  <g transform="translate(140, 395)">
    <!-- Pill 1: Trigonometry -->
    <rect x="0" y="0" width="165" height="42" rx="21" fill="#1e1e1e" stroke="#2e2e2e" stroke-width="1" />
    <text x="20" y="27" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="#06b6d4">sin · cos · tan</text>

    <!-- Pill 2: Logarithms -->
    <rect x="180" y="0" width="150" height="42" rx="21" fill="#1e1e1e" stroke="#2e2e2e" stroke-width="1" />
    <text x="200" y="27" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="#8b5cf6">log · ln · eˣ</text>

    <!-- Pill 3: Fractions -->
    <rect x="345" y="0" width="160" height="42" rx="21" fill="#1e1e1e" stroke="#2e2e2e" stroke-width="1" />
    <text x="365" y="27" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="#10b981">Fractions (½)</text>

    <!-- Pill 4: Multi-Language -->
    <rect x="520" y="0" width="175" height="42" rx="21" fill="#1e1e1e" stroke="#2e2e2e" stroke-width="1" />
    <text x="540" y="27" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="600" fill="#f59e0b">10 Languages</text>

    <!-- Pill 5: 100% Free -->
    <rect x="710" y="0" width="150" height="42" rx="21" fill="#0070f3" fill-opacity="0.15" stroke="#0070f3" stroke-width="1" />
    <text x="732" y="27" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="700" fill="#38bdf8">100% Free</text>
  </g>

  <!-- Bottom URL text -->
  <text x="140" y="490" font-family="'JetBrains Mono', monospace" font-size="16" font-weight="600" fill="#52525b">
    https://onscicalc.com
  </text>
</svg>
`;

async function generate() {
  const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');
  await sharp(Buffer.from(svg))
    .png({ quality: 95 })
    .toFile(outputPath);
  console.log('og-image.png generated at:', outputPath);
}

generate().catch(console.error);
