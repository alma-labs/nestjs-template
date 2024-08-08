import { S3Client, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { fromEnv } from '@aws-sdk/credential-provider-env';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Logger } from '@nestjs/common';

// Configure AWS S3
const s3Client = new S3Client({ credentials: fromEnv(), region: process.env.AWS_REGION });

export class AwsService {
  private readonly logger = new Logger(AwsService.name);

  async uploadFileToS3(file: Express.Multer.File) {
    const fileExtName = path.extname(file?.originalname ? file.originalname : 'Nonameprovided');
    const randomName = uuidv4();
    const fileName = `${randomName}${fileExtName}`;
    const bucketName = process.env.AWS_S3_BUCKET_NAME;

    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const upload = new Upload({ client: s3Client, params: params });

      await upload.done();

      return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (err) {
      this.logger.error('Issue with AWS: ', err.message);
      throw new Error(`File upload failed: ${err.message}`);
    }
  }
}
