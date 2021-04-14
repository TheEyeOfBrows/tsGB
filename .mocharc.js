module.exports = {
  exit: false,
  bail: false,
  slow: '75',
  recursive: true,
  color: true,
  spec: ['./test/**/*.spec.ts'],
  reporter: 'spec',
  require: ['ts-node/register'],
}