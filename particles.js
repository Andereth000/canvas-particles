import {canvas, cx, cy, drawPixel} from "./canvas.js";
import * as camera from "./camera.js"

// STATE -> UPDATE -> DRAW
// GENERATE PARTICLES

// RANDOM IN RANGE | Math.random() * (max - min) + min

const degToRad = deg => deg * Math.PI / 180;
const GRAVITY = 100;

export const particles = [];

export function drawRing()
{
  for (let i = 0; i < 360; i++)
  {
    particles.push({
      x: cx,
      y: cx,
      vx: Math.cos(degToRad(i)) * 500,
      vy: Math.sin(degToRad(i)) * 500,
      size: 1,
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
    });
  }
}

export function drawLgOledFirework(x, y)
{
  for (let i = 0; i < 360; i++)
  {
    const angle = Math.random() * 360;
    const speed = Math.random() * 50;

    particles.push({
      x: x,
      y: y,
      vx: Math.cos(degToRad(angle)) * speed,
      vy: Math.sin(degToRad(angle)) * speed,
      size: 1,
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
      gravity: false,
      drag: 0,
      life: Infinity,
      burnRate: 0
    });
  }
}

export function drawFirework(x, y, z)
{
  const PARTICLE_COUNT = 1000;

  for (let i = 0; i < PARTICLE_COUNT; i++)
  {
    const angle = Math.random() * 360;
    const azimuth = (2 * Math.PI) * Math.random();
    const u = 2 * Math.random() - 1;
    const polar_angle = Math.acos(u);

    /*const speed = Math.random() < .85
    ? 200 * Math.sqrt(Math.random())
    : 200 + Math.random() * 150;*/

    //const speed = 350 * Math.pow(Math.random(), .35);

    let speed = 200 * Math.sqrt(Math.random());

    // DISPLACE STARS OUTSIDE CIRCLE
    if (Math.random() < .25) {
      speed *= .4 + Math.random() * .7;
    }

    const STAR_COLORS = [
      "#FF3030",
      "#60FF35",
      "#307BFF",
      "#FFD335",
      "#FF872A",
      "#FFF0BF"
    ];

    const color =
    STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

    particles.push({
      x: x,
      y: y,
      z: z,
      vx: speed * Math.sin(polar_angle) * Math.cos(azimuth),//Math.cos(degToRad(angle)) * speed,
      vy: speed * Math.cos(polar_angle),//Math.sin(degToRad(angle)) * speed,
      vz: speed * Math.sin(polar_angle) * Math.sin(azimuth),//Math.sin(degToRad(angle)) * speed,
      size: 1,
      /*color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,*/
      color: color,
      gravity: true,
      life: 1,
      burnRate: Math.random() * .3 + .3,
      drag: 0.5 + Math.random() * 0.8
    });
  }
}

export function drawLorenzAttractor(x, y, z)
{
  const PARTICLE_COUNT = 3;

  for (let i = 0; i < PARTICLE_COUNT; i++)
  {
    const prandtl = 10;
    const rayleigh = 28;
    const beta = 8/3

    const STAR_COLORS = [
      "#FF3030",
      "#60FF35",
      "#307BFF",
      "#FFD335",
      "#FF872A",
      "#FFF0BF"
    ];

    const color =
    STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

    particles.push({
      x: x + i * .001,
      y: y,
      z: z,
      vx: 0,
      vy: 0,
      vz: 0,
      size: 1,
      /*color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,*/
      color: color,
      gravity: false,
      life: 1,
      burnRate: 0,
      drag: 0,
      lorenz_active: true,
      prandtl: prandtl,
      rayleigh: rayleigh,
      beta: beta,
    });
  }
}

// v = d/t | vt = d
export function updateParticle(particles, deltaTime)
{
  for (const p of particles)
  {
    const damping = Math.exp(-p.drag * deltaTime);

    p.vx *= damping;
    p.vy *= damping;
    p.vz *= damping;

    // APPLY VELOCITY
    p.x += p.vx * deltaTime;
    p.y += p.vy * deltaTime;
    p.z += p.vz * deltaTime;

    // APPLY GRAVITY
    if (p.gravity == true)
    {
      p.vy -= GRAVITY * deltaTime;
    }

    // STAR BURN OUT RATE 
    p.life -= p.burnRate * deltaTime;

    // LORENZ VELOCITIES/TIMESTEP
    const t = 0.005;

    if (p.lorenz_active)
    {
      for (let step = 0; step < 10; step++)
      {
        const vx = p.prandtl * (p.y - p.x);
        const vy = p.x * (p.rayleigh - p.z) - p.y;
        const vz = p.x * p.y - p.beta * p.z;

        p.x += vx * t;
        p.y += vy * t;
        p.z += vz * t;

        const projected = {
          x: p.x * 16,
          y: (p.z - 25) * 16,
          z: 500
        };

        const { sx, sy } = camera.project(projected);

        drawPixel(
          Math.floor(sx),
          Math.floor(sy),
          p.color,
          p.size
        );
      }
    }

    // BORDER COLLISIONS 2D
    /*if (p.x >= canvas.width - p.size)
    {
      p.x = canvas.width - p.size;
      p.vx = -p.vx
    }
    if (p.x <= 0)
    {
      p.x = 0;
      p.vx = -p.vx
    }

    if (p.y >= canvas.height - p.size)
    {
      p.y = canvas.height - p.size;
      p.vy = -p.vy
    }
    if (p.y <= 0)
    {
      p.y = 0;
      p.vy = -p.vy
    }*/
  }

  // CULL DEAD STARS
  for (let i = particles.length - 1; i >= 0; i--) {
  if (particles[i].life <= 0) {
    particles.splice(i, 1);
  }
  }
}

export function drawParticle(particles)
{
  for (const p of particles)
  {
      if (p.lorenz_active) continue;

      const {sx, sy} = camera.project(p);

      drawPixel(
        Math.floor(sx),
        Math.floor(sy),
        p.color,
        p.size
      );
    }
  }