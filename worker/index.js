const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  //1,1,2,3,5,8
  let prev = 1
  let current = 1
  for (let i = 1; i < index; i++) {
    temp = current
    current += prev
    prev = temp
  }
  return current
  // if (index < 2) return 1;
  // return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
