/**
 * Clamp a value between min and max
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Linear interpolation between two values
 */
export const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

/**
 * Map a value from one range to another
 */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Format a number to fixed decimal places
 */
export const formatNumber = (value, decimals = 2) => {
  return Number(value).toFixed(decimals);
};

/**
 * Generate a unique ID
 */
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Convert degrees to radians
 */
export const degToRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Convert radians to degrees
 */
export const radToDeg = (radians) => {
  return radians * (180 / Math.PI);
};

/**
 * Calculate color based on value (for gradients)
 */
export const getColorForValue = (value, minColor, maxColor, min = 0, max = 100) => {
  const ratio = clamp((value - min) / (max - min), 0, 1);
  
  const minRGB = hexToRgb(minColor);
  const maxRGB = hexToRgb(maxColor);
  
  const r = Math.round(lerp(minRGB.r, maxRGB.r, ratio));
  const g = Math.round(lerp(minRGB.g, maxRGB.g, ratio));
  const b = Math.round(lerp(minRGB.b, maxRGB.b, ratio));
  
  return rgbToHex(r, g, b);
};

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convert RGB to hex color
 */
export const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Create a 3D point object
 */
export const createPoint = (x, y, z) => ({ x, y, z });

/**
 * Calculate distance between two 3D points
 */
export const distance3D = (p1, p2) => {
  return Math.sqrt(
    Math.pow(p2.x - p1.x, 2) +
    Math.pow(p2.y - p1.y, 2) +
    Math.pow(p2.z - p1.z, 2)
  );
};
