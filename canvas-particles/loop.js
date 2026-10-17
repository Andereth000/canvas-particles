let lastTime;

export function startLoop(onFrame) 
{
  function frame(timestamp) 
  {
    if (lastTime !== undefined) 
    {
      const frameTime = timestamp - lastTime;
      const fps = 1000 / frameTime;
      const deltaTime = frameTime / 1000;

      onFrame(fps, frameTime, deltaTime);
    }

    lastTime = timestamp;
    
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}