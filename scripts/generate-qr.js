const QRCode = require("qrcode");
const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const URL = "https://client-bday-surprise.vercel.app";
const OUTPUT = path.join(__dirname, "..", "public", "qr-love.png");
const CANVAS_SIZE = 1000;
const MODULE_SIZE = 14;
const PADDING = 60;

// Heart shape check for a given (x, y) relative to center
function isInHeart(px, py, size) {
  // Parametric heart equation: (x^2 + y^2 - 1)^3 - x^2*y^3 = 0
  const x = (px / size) * 2.2;
  const y = -(py / size) * 2.2 + 0.4;
  const val = Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y;
  return val <= 0;
}

async function generate() {
  // Generate QR data matrix with high error correction (30% recoverable)
  const qrData = await QRCode.create(URL, {
    errorCorrectionLevel: "H",
  });

  const moduleCount = qrData.modules.size;
  const qrTotalSize = moduleCount * MODULE_SIZE;
  const canvasSize = Math.max(CANVAS_SIZE, qrTotalSize + PADDING * 2 + 120);

  const canvas = createCanvas(canvasSize, canvasSize);
  const ctx = canvas.getContext("2d");

  // Background - soft gradient
  const bgGrad = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
  bgGrad.addColorStop(0, "#fff5f5");
  bgGrad.addColorStop(0.5, "#ffe4e6");
  bgGrad.addColorStop(1, "#fdf2f8");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw decorative pixel hearts in corners
  const heartPixelPattern = [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ];

  function drawPixelHeart(startX, startY, pixSize, color) {
    ctx.fillStyle = color;
    for (let r = 0; r < heartPixelPattern.length; r++) {
      for (let c = 0; c < heartPixelPattern[r].length; c++) {
        if (heartPixelPattern[r][c]) {
          ctx.fillRect(startX + c * pixSize, startY + r * pixSize, pixSize - 1, pixSize - 1);
        }
      }
    }
  }

  // Corner pixel hearts
  drawPixelHeart(20, 20, 8, "#fda4af");
  drawPixelHeart(canvasSize - 60, 20, 8, "#fb7185");
  drawPixelHeart(20, canvasSize - 60, 8, "#fb7185");
  drawPixelHeart(canvasSize - 60, canvasSize - 60, 8, "#fda4af");

  // Extra small hearts scattered
  drawPixelHeart(80, canvasSize - 45, 6, "#fecdd3");
  drawPixelHeart(canvasSize - 100, canvasSize - 45, 6, "#fecdd3");
  drawPixelHeart(80, 30, 6, "#fecdd3");
  drawPixelHeart(canvasSize - 100, 30, 6, "#fecdd3");

  // QR code offset to center
  const offsetX = (canvasSize - qrTotalSize) / 2;
  const offsetY = (canvasSize - qrTotalSize) / 2 - 10;

  // Draw QR modules with heart-shaped gradient coloring
  const centerQRx = qrTotalSize / 2;
  const centerQRy = qrTotalSize / 2;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      const isDark = qrData.modules.get(row, col);
      const x = offsetX + col * MODULE_SIZE;
      const y = offsetY + row * MODULE_SIZE;

      if (isDark) {
        // Calculate distance from center for color gradient
        const dx = col * MODULE_SIZE + MODULE_SIZE / 2 - centerQRx;
        const dy = row * MODULE_SIZE + MODULE_SIZE / 2 - centerQRy;
        const dist = Math.sqrt(dx * dx + dy * dy) / (qrTotalSize / 2);

        // Check if this module is a finder/alignment pattern (keep them solid)
        const isFinderPattern =
          (row < 7 && col < 7) ||
          (row < 7 && col >= moduleCount - 7) ||
          (row >= moduleCount - 7 && col < 7);

        if (isFinderPattern) {
          // Finder patterns - solid rose color with rounded look
          ctx.fillStyle = "#e11d48";
          const radius = 3;
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + MODULE_SIZE - radius, y);
          ctx.quadraticCurveTo(x + MODULE_SIZE, y, x + MODULE_SIZE, y + radius);
          ctx.lineTo(x + MODULE_SIZE, y + MODULE_SIZE - radius);
          ctx.quadraticCurveTo(x + MODULE_SIZE, y + MODULE_SIZE, x + MODULE_SIZE - radius, y + MODULE_SIZE);
          ctx.lineTo(x + radius, y + MODULE_SIZE);
          ctx.quadraticCurveTo(x, y + MODULE_SIZE, x, y + MODULE_SIZE - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.fill();
        } else {
          // Data modules - gradient from rose-500 to pink-500
          const r = Math.round(244 - dist * 40);
          const g = Math.round(63 + dist * 20);
          const b = Math.round(94 + dist * 60);
          ctx.fillStyle = `rgb(${Math.min(255, r)}, ${Math.max(0, g)}, ${Math.min(255, b)})`;

          // Rounded pixel squares
          const margin = 1;
          const radius = 3;
          const mx = x + margin;
          const my = y + margin;
          const ms = MODULE_SIZE - margin * 2;
          ctx.beginPath();
          ctx.moveTo(mx + radius, my);
          ctx.lineTo(mx + ms - radius, my);
          ctx.quadraticCurveTo(mx + ms, my, mx + ms, my + radius);
          ctx.lineTo(mx + ms, my + ms - radius);
          ctx.quadraticCurveTo(mx + ms, my + ms, mx + ms - radius, my + ms);
          ctx.lineTo(mx + radius, my + ms);
          ctx.quadraticCurveTo(mx, my + ms, mx, my + ms - radius);
          ctx.lineTo(mx, my + radius);
          ctx.quadraticCurveTo(mx, my, mx + radius, my);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }

  // Draw a pixel heart in the CENTER of the QR code (error correction H handles this)
  const heartCenterSize = 10;
  const heartStartX = offsetX + (qrTotalSize - heartPixelPattern[0].length * heartCenterSize) / 2;
  const heartStartY = offsetY + (qrTotalSize - heartPixelPattern.length * heartCenterSize) / 2;

  // White background behind center heart
  const bgPad = 8;
  ctx.fillStyle = "#fff5f5";
  ctx.beginPath();
  const bx = heartStartX - bgPad;
  const by = heartStartY - bgPad;
  const bw = heartPixelPattern[0].length * heartCenterSize + bgPad * 2;
  const bh = heartPixelPattern.length * heartCenterSize + bgPad * 2;
  const br = 8;
  ctx.moveTo(bx + br, by);
  ctx.lineTo(bx + bw - br, by);
  ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
  ctx.lineTo(bx + bw, by + bh - br);
  ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
  ctx.lineTo(bx + br, by + bh);
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
  ctx.lineTo(bx, by + br);
  ctx.quadraticCurveTo(bx, by, bx + br, by);
  ctx.closePath();
  ctx.fill();

  // Draw the pixel heart
  const heartGrad = ctx.createLinearGradient(
    heartStartX,
    heartStartY,
    heartStartX + heartPixelPattern[0].length * heartCenterSize,
    heartStartY + heartPixelPattern.length * heartCenterSize
  );
  heartGrad.addColorStop(0, "#f43f5e");
  heartGrad.addColorStop(1, "#ec4899");

  for (let r = 0; r < heartPixelPattern.length; r++) {
    for (let c = 0; c < heartPixelPattern[r].length; c++) {
      if (heartPixelPattern[r][c]) {
        ctx.fillStyle = heartGrad;
        const px = heartStartX + c * heartCenterSize;
        const py = heartStartY + r * heartCenterSize;
        ctx.fillRect(px, py, heartCenterSize - 1, heartCenterSize - 1);
      }
    }
  }

  // Title text at bottom
  ctx.fillStyle = "#e11d48";
  ctx.font = "bold 24px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Scan untuk kejutan spesial!", canvasSize / 2, canvasSize - 30);

  // Subtle border
  ctx.strokeStyle = "#fecdd3";
  ctx.lineWidth = 3;
  const borderRadius = 20;
  ctx.beginPath();
  ctx.moveTo(borderRadius + 8, 8);
  ctx.lineTo(canvasSize - borderRadius - 8, 8);
  ctx.quadraticCurveTo(canvasSize - 8, 8, canvasSize - 8, borderRadius + 8);
  ctx.lineTo(canvasSize - 8, canvasSize - borderRadius - 8);
  ctx.quadraticCurveTo(canvasSize - 8, canvasSize - 8, canvasSize - borderRadius - 8, canvasSize - 8);
  ctx.lineTo(borderRadius + 8, canvasSize - 8);
  ctx.quadraticCurveTo(8, canvasSize - 8, 8, canvasSize - borderRadius - 8);
  ctx.lineTo(8, borderRadius + 8);
  ctx.quadraticCurveTo(8, 8, borderRadius + 8, 8);
  ctx.closePath();
  ctx.stroke();

  // Save
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`QR code saved to: ${OUTPUT}`);
  console.log(`URL: ${URL}`);
  console.log(`Size: ${canvasSize}x${canvasSize}px`);
  console.log(`Modules: ${moduleCount}x${moduleCount}`);
}

generate().catch(console.error);
