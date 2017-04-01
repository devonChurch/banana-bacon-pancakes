const s3rverClient = require('./client');

console.log('s3rverClient', s3rverClient);

const params = {
	Bucket: 'research-hub',
};

 // Call S3 to create the bucket
s3rverClient.createBucket(params, (error, data) => {

	if (error) console.log('Error', error);
	else console.log('Success', data);

});
