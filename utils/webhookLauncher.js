const request = require('requestretry');
const extend = require('util')._extend;

const logger = require('./loggerUtils');
const config = require('../config/config');

module.exports = {
  set(payload, data, message, channel) {
    const req = {
      uri: payload.uri || '',
      method: 'POST',
      body: JSON.stringify(data),
      header: {
        'Content-Type': 'application/json'
      }
    };
    const opts = {
      maxAttempts: config.app.webHook.maxAttempts || 5,
      retryDelay: config.app.webHook.retryDelay || 5000,
      retryStrategy: request.RetryStrategies.HTTPOrNetworkError,
    };
    extend(req, opts);

    request(req, (error, response, body) => {
      if (!error) {
        logger.log(`[Complete] ${message.content.toString()}`);
      } else {
        logger.log(`[Incomplete] Delivery failed for ${message.content.toString()} after ${options.maxAttempts} attempts.`);
        channel.reject(message, false);
      }
    });
  }
}