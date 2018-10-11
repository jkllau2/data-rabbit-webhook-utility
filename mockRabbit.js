// Libraries
const amqp = require('amqplib');
const axios = require('axios');
const logger = require('./utils/loggerUtils');

// Config
const config = require('./config/config');

const requestDataUtils = {
  async requestData() {
    const uri = config.app.api.uri || '';
    axios.get(uri)
      .then((response) => {
          if (!response) throw new Error(`Error getting data from ${uri}.`);
          const data = response.data.results;
          this.connect(data);
      })
      .catch(err => console.error(err));
  },
  connect(data) {
    amqp.connect('amqp://localhost')
    .done((connection) => {
      connection.createChannel()
        .done((channel) => {
          logger.log('Channel opened', 'ready');

          process.on('SIGING', () => {
            logger.log('SIGINT received ... cleaning up');
            connection.close();
            process.exit(0);
          });

          channel.assertQueue('webhook-data', {
            durable: true,
            noAck: false,
          });

          for (let d of data) {
            channel.sendToQueue('webhook-data', new Buffer(JSON.stringify(d)));
          }

          channel.on('error', (err) => {
            logger.log(`Channel error ${err}`, 'error');
          });

          channel.on('close', (err) => {
            logger.log(`Channel closed ${err}`, 'error');
          });
        }, (err) => {
          logger.log(`Error creating channel ${err}`, 'error');
        });
    }, (err) => {
      logger.log(`Error creating connection ${err}`, 'error');
    });
  }
}

module.exports = requestDataUtils.requestData();