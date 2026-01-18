const { createClient } = require('redis');
require('dotenv').config();

const redisClient = createClient({
  url: process.env.REDIS_URI,
});

redisClient.connect();

redisClient.on('connect', () => {
   console.log('Redis Connected')
})

redisClient.on('error', (err) => {
   console.log(err)
})

module.exports = redisClient
