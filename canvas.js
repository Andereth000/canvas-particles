export const canvas = document.getElementById("particles");
export const cx = canvas.width / 2;
export const cy = canvas.height / 2;

const contextType = "2d";
const context = canvas.getContext(contextType);

export function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

export const SKIES = {
  pitch_black: [
    [1.00, "black"]
  ],
  
  day: [
    [0.00, "#80B3FF"],
    [1.00, "#FFFFFF"]
  ],

  twilight: [
    [0.00, "#080F2B"],
    [0.30, "#18254D"],
    [0.60, "#55466E"],
    [0.82, "#B56879"],
    [1.00, "#E9A073"]
  ],

  dusk: [
    [0.00, "#030714"],
    [0.40, "#0B1530"],
    [0.75, "#252344"],
    [1.00, "#70455B"]
  ]
};

export function clear() {
  context.fillStyle = "#000"
  context.fillRect(0, 0, canvas.width, canvas.height);
}

export function clearAccumulate(stops, fade)
{
  const sky = context.createLinearGradient(
    0, 0, 0, canvas.height
  );

  for (const [position, color] of stops) {
    sky.addColorStop(position, color);
  }

  context.save();
  context.globalAlpha = fade;
  context.fillStyle = sky;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();
}

export function drawPixel(sx, sy, color, size) 
{
  context.fillStyle = color;
  context.fillRect(sx, sy, size, size);
}