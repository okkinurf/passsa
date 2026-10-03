const {
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} = require('@aws-sdk/client-s3');

class S3ObjectClient {
  constructor(config) {
    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        ...(config.sessionToken ? { sessionToken: config.sessionToken } : {}),
      },
      ...(config.endpoint ? { endpoint: config.endpoint, forcePathStyle: true } : {}),
      maxAttempts: 3,
    });
  }

  verifyBucket(bucket) {
    return this.client.send(new HeadBucketCommand({ Bucket: bucket }));
  }

  async getJson(bucket, key) {
    const response = await this.client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    if (!response.Body) throw new Error('Objek S3 kosong atau tidak dapat dibaca.');
    const value = JSON.parse(await response.Body.transformToString('utf-8'));
    return { value, etag: response.ETag || null };
  }

  putJson(bucket, key, value) {
    return this.client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(value),
      ContentType: 'application/json; charset=utf-8',
    }));
  }

  close() {
    this.client.destroy();
  }
}

module.exports = { S3ObjectClient };
