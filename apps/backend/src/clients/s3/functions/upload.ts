import { Readable } from "stream";
import s3Client from "../s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadFileToS3(
  key: string,
  body: Buffer | Readable,
  contentType?: string
) {
  return await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
}
