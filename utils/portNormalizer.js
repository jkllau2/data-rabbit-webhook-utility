module.exports = {
  normalizePort: (portValue) => {
    const port = parseInt(portValue, 10);

    if (isNaN(port)) {
      return portValue;
    }

    if (port >= 0) {
      return port;
    }

    return false;
  },
};
