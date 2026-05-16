const { S3Client, PutBucketCorsCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const run = async () => {
  try {
    const data = await client.send(
      new PutBucketCorsCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        CORSConfiguration: {
          CORSRules: [
            {
              AllowedHeaders: ["*"],
              AllowedMethods: ["PUT", "POST", "GET", "HEAD"],
              AllowedOrigins: ["*"],
              ExposeHeaders: ["ETag"],
              MaxAgeSeconds: 3000
            },
          ],
        },
      })
    );
    console.log("CORS updated successfully!", data);
  } catch (err) {
    console.log("Error updating CORS:", err);
  }
};
run();
