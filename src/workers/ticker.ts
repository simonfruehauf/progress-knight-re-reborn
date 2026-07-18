self.onmessage = () => {
  setInterval(() => {
    postMessage(null);
  }, 50);
};
