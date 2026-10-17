import {canvas, resizeCanvas, clear, clearAccumulate, SKIES} from "./canvas.js"
import {startLoop} from "./loop.js"
import {drawRing, drawLgOledFirework, drawFirework, drawLorenzAttractor, particles, drawParticle, updateParticle} from "./particles.js"
import * as camera from "./camera.js"

function main()
{
  resizeCanvas();

  //clear(); // TEMP LORENZ TESTING
  
  window.addEventListener("resize", resizeCanvas);
  
  canvas.addEventListener("pointerdown", (event) => {
    const rect = canvas.getBoundingClientRect();

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    // 2D TAPS
    //const x = (event.clientX - rect.left) * canvas.width / rect.width;
    //const y = (event.clientY - rect.top) * canvas.height / rect.height;

    const sx = (event.clientX - rect.left) * canvas.width / rect.width;
    const sy = (event.clientY - rect.top) * canvas.height / rect.height;

    // 3D TAPS
    const z = 500;
    const {wx, wy} = camera.unproject(sx, sy, z)
    
    //drawLgOledFirework(x, y);
    //drawFirework(wx, wy, z);
    drawLorenzAttractor(1, 1, 1);
  });
  
  // LOGGING
  const debug = document.getElementById("debug");

  
  startLoop(function(fps, frameTime, deltaTime)
  {

  //clear(); // DISABLE FOR MAGICAL FIREWORKS, ENABLE FOR LG OLED FIREWORKS 
  clearAccumulate(SKIES.pitch_black, .08); // CONTAINED MAGIC
    
  updateParticle(particles, deltaTime);
  drawParticle(particles);
    
  debug.textContent = 
    `
    FPS:${fps.toFixed(1)}
    Frametime:${frameTime.toFixed(2)}
    Delta Time:${deltaTime.toFixed(5)}
    
    SW:${canvas.width}
    SH:${canvas.height}
    `;
    //PX:${particle.x.toFixed(1)}
    //VX:${particle.vx.toFixed(1)}
  });

  //drawRing()
  //drawFirework(x, y);
}

main();