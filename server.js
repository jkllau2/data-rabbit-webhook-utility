const express = require('express');
const app = express();

// Utilieis
const logger = require('./utils/loggerUtils');
const portNormalizer = require('./utils/portNormalizer');

logger.log('Starting API server', 'ready');
logger.log(`Running Node version ${process.version}`, 'ready');

app.set('port', portNormalizer.normalizePort(process.env.PORT || '3333'));

app.listen(app.get('port'), () => {
  logger.log(`Find the server at: http://localhost:${app.get('port')}/`, 'ready');
});

require('./rabbit');
