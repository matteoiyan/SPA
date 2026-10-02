import os
import uuid
import boto3
from dotenv import load_dotenv

load_dotenv()

AWS_REGION = os.getenv("AWS_REGION")
VIDEOS_BUCKET = os.getenv("S3_VIDEOS_BUCKET")
THUMBNAILS_BUCKET = os.getenv("S3_THUMBNAILS_BUCKET")

s3 = boto3.client("s3", region_name=AWS_REGION)


def upload_file(file, bucket: str, folder: str):
    extension = file.filename.split(".")[-1].lower()

    filename = f"{folder}/{uuid.uuid4()}.{extension}"

    s3.upload_fileobj(
        file.file,
        bucket,
        filename,
        ExtraArgs={
            "ContentType": file.content_type
        }
    )

    return filename


def upload_video(file):
    return upload_file(file, VIDEOS_BUCKET, "videos")


def upload_thumbnail(file):
    return upload_file(file, THUMBNAILS_BUCKET, "thumbnails")

def generate_presigned_url(bucket: str, key: str):
    return s3.generate_presigned_url(
        "get_object",
        Params={
            "Bucket": bucket,
            "Key": key
        },
        ExpiresIn=3600
    )


def get_video_url(key: str):
    return generate_presigned_url(
        VIDEOS_BUCKET,
        key
    )


def get_thumbnail_url(key: str):
    return generate_presigned_url(
        THUMBNAILS_BUCKET,
        key
    )
def delete_video_file(key: str):
    s3.delete_object(
        Bucket=VIDEOS_BUCKET,
        Key=key
    )


def delete_thumbnail_file(key: str):
    s3.delete_object(
        Bucket=THUMBNAILS_BUCKET,
        Key=key
    )
