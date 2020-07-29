import { useEffect } from 'react';

function useKeyDown(key, callback, active = true) {
  useEffect(() => {
    const keydown = (e) => {
      if (e.key === key) {
        callback();
      }
    };

    if (active) {
      window.addEventListener('keydown', keydown);
    }

    return () => {
      if (active) {
        window.removeEventListener('keydown', keydown);
      }
    };
  }, [callback, active]);
}

export default useKeyDown;
