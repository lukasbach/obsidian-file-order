declare global {
  interface Window {
    process?: any;
  }
}

// Simple process polyfill for Obsidian mobile
window.process = {
  env: {
    NODE_ENV: "production",
  },
  // Add any other process properties your code might need
  platform: "android", // or 'ios' depending on platform
  version: "",
  nextTick: (fn: Function) => setTimeout(fn, 0),
};

export {};
