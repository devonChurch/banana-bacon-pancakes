const S3rver = require('s3rver');

const s3rverClient = new S3rver({
    port: 4569,
    hostname: 'localhost',
    silent: false,
    directory: './tmp',
});

module.exports = s3rverClient;
