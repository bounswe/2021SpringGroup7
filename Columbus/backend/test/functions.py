from src.settings import S3_CLIENT,BUCKET_NAME

def download_from_s3(path_in_local,path_in_s3,bucket_name=BUCKET_NAME):
    try:
        S3_CLIENT.download_file(bucket_name,path_in_s3,path_in_local)
        print("Download Successful")
        return True
    except FileNotFoundError:
        print("The file was not found")
        return False

def upload_to_s3(path_in_local, s3_file,bucket_name=BUCKET_NAME):
    try:
        S3_CLIENT.upload_file(path_in_local, bucket_name, s3_file)
        print("Upload Successful")
        return True
    except FileNotFoundError:
        print("The file was not found")
        return False