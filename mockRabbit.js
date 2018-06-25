const amqp = require('amqplib');
const faker = require('faker');
const logger = require('./utils/loggerUtils');

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

        setInterval(() => {
            const fakeData = {
            data: {
              name: faker.name.findName(),
              email: faker.internet.email(),
              state: faker.address.state(),
              latitude: faker.address.longitude(),
              avg_temperature: Math.random() * (100 - 1) + 1,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          };
          channel.sendToQueue('webhook-data', new Buffer(JSON.stringify(fakeData)));
        }, 2 * 1000);

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
