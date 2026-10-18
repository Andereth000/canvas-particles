import { canvas } from "./canvas.js";

const focal = 500;

export const position =
{
  x: 0,
  y: 0,
  z: 0
}

// PERSPECTIVE PROJECTION
export function project(p) 
{
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  
  const sx = cx + ((p.x - position.x) * focal) / (p.z - position.z);
  const sy = cy - ((p.y - position.y) * focal) / (p.z - position.z);

  return { sx, sy };
}

// PERSPECTIVE PROJECTION REVERSED
export function unproject(sx, sy, z)
{
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  
  const wx = ((sx - cx) * z) / focal;
  const wy = -((sy - cy) * z) / focal;

  return { wx, wy };
}