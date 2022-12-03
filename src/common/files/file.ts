import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = process.env.ROOM_BUCKET;

const s3Client = new S3Client({});

export const save = async (filename, contentType, data) => {
	const params = {
		Bucket: BUCKET_NAME,
		Key: `${filename}`,
		ACL: "public-read",
		Body: data,
		ContentType: contentType,
	};

	const resp = await s3Client.send(new PutObjectCommand(params));

	return `https://${BUCKET_NAME}.s3.amazonaws.com/${filename}`;
};
