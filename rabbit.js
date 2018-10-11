// Libraries
const amqp = require('amqplib');
const logger = require('./utils/loggerUtils');
const webhookLauncher = require('./utils/webhookLauncher');


// config
const config = require('./config/config');

const rabbit = {
  consume() {
    amqp.connect('amqp://localhost')
      .then((connection) => {
        process.on('SIGINT', () => {
          logger.log('SIGNIG received ... cleaning up');
          connection.close();
          process.exit(0);
        });
        return connection.createChannel();
      }).then((channel) => {
          logger.log('AMQP channel opened', 'ready');
          const queueName = 'webhook-data';

          channel.prefetch(1);
          channel.assertQueue(queueName, {
            durable: true,
            noAck: false,
          });

          channel.consume(queueName, (message) => {
            let data;

            try {
              data = JSON.parse(message.content.toString());
            } catch (err) {
              logger.log(`Error parsing ${queueName} data, ${message.content.toString()} [${err}]`, 'error');
            }

            if (data) {
                const payload = {
                filter: {},
                uri: config.app.webHook.uri
              };

              // send data to web hook
              webhookLauncher.set(payload, data, message, channel);

              // ack message
              channel.ack(message);
            }
          }).catch((error) => {
              logger.log(`Error consuming webhook device data ${error}`, 'error');
          });

          channel.on('error', (error) => {
            logger.log(`Channel error ${error}`, 'error');
          });

          channel.on('close', (error) => {
            logger.log(`Channel closed ${error}`, 'error');
          });
        });
    }
}

module.exports = rabbit.consume();
