const express = require('express');
const app = express();

// Middleware
const bodyParser = require('body-parser');
const boolParser = require('express-query-boolean');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Utilieis
const logger = require('./utils/loggerUtils');
const portNormalizer = require('./utils/portNormalizer');

logger.log('Starting API server', 'ready');
logger.log(`Running Node version ${process.version}`, 'ready');

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(cookieParser());
app.use(boolParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(require('morgan')('combined'));
app.use(require('compression')());

app.set('port', portNormalizer.normalizePort(process.env.PORT || '3333'));
require('./routes').api(app);

app.listen(app.get('port'), () => {
  logger.log(`Find the server at: http://localhost:${app.get('port')}/`, 'ready');
});

require('./rabbit');
