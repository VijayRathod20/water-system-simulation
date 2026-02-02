import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for animation frame loop
 * Provides a clean way to run animations with delta time
 */
export const useAnimationFrame = (callback, isActive = true) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const callbackRef = useRef(callback);
  
  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callbackRef.current(deltaTime, time);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);
  
  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive, animate]);
};

/**
 * Hook for getting elapsed time
 */
export const useElapsedTime = (isRunning = true) => {
  const startTimeRef = useRef(Date.now());
  const elapsedRef = useRef(0);
  
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      elapsedRef.current = Date.now() - startTimeRef.current;
    }, 16);
    
    return () => clearInterval(interval);
  }, [isRunning]);
  
  const reset = useCallback(() => {
    startTimeRef.current = Date.now();
    elapsedRef.current = 0;
  }, []);
  
  return {
    elapsed: elapsedRef.current,
    reset
  };
};

/**
 * Hook for smooth value interpolation
 */
export const useSmoothValue = (targetValue, speed = 0.1) => {
  const currentRef = useRef(targetValue);
  
  useAnimationFrame((deltaTime) => {
    const diff = targetValue - currentRef.current;
    currentRef.current += diff * speed * (deltaTime / 16);
  });
  
  return currentRef.current;
};

export default useAnimationFrame;
