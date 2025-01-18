import { SECRETS } from "../utils/helpers";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../utils/config/aws.config";

class FileUpload {
  async uploadFileToS3(file: Express.Multer.File): Promise<string | null> {
    if (!file) return null;
    const uploadParams = {
      Bucket: SECRETS.AWS_BUCKET_NAME,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
      return `https://${SECRETS.AWS_BUCKET_NAME}.s3.${SECRETS.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
    } catch (error: any) {
      console.log(error);
      return error as string
    }
  }
}

export default new FileUpload();
