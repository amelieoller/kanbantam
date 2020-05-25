import { useState, useEffect } from 'react';

function useResize(element = null) {
  let [{ screenWidth, screenHeight, ratioWh, ratioHw, rect }, setState] = useState({
    screenWidth: 0,
    screenHeight: 0,
    ratioWh: 0,
    ratioHw: 0,
    rect: undefined,
  });

  useEffect(() => {
    const onResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const ratioWh = screenWidth / screenHeight;
      const ratioHw = screenHeight / screenWidth;
      let newRect;

      if (element && element.current) {
        //rect = element.current.getBoundingClientRect();
        const clientRect = element.current.getBoundingClientRect();

        newRect = {
          width: clientRect.width,
          height: clientRect.height,
          left: clientRect.left,
          right: clientRect.right,
          top: clientRect.top,
          bottom: clientRect.bottom,
        };
      }

      setState({ screenWidth, screenHeight, ratioWh, ratioHw, rect: newRect });
    };

    window.addEventListener('resize', onResize, false);
    onResize();
    return () => {
      window.removeEventListener('resize', onResize, false);
    };
  }, [element]);

  return { screenWidth, screenHeight, ratioWh, ratioHw, rect };
}

export default useResize;
