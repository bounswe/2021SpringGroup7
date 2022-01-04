import AWS from 'aws-sdk';
import {decode} from 'base64-arraybuffer';

const S3_BUCKET = 'columbus-test';
const REGION = 'eu-central-1';

AWS.config.update({
  accessKeyId: 'AKIA2SPVCAGPCLCMIDIG',
  secretAccessKey: '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',
});

const myBucket = new AWS.S3({
  params: {Bucket: S3_BUCKET},
  region: REGION,
});

export async function UploadImage(guid, file, setImageUrl, setProgress) {
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(file.fileName);
  console.log(ext);
  const url = `posts/${guid}${ext[0]}`;

  const arrayBuffer = decode(file.base64);
  const params = {
    Body: arrayBuffer,
    Bucket: S3_BUCKET,
    Key: url,
  };

  myBucket
    .putObject(params)
    .on('httpUploadProgress', evt => {
      setProgress(Math.round((evt.loaded / evt.total) * 100));
    })
    .send(err => {
      if (err) console.log('err image upload: ', err);
      setImageUrl('https://columbus-test.s3.eu-central-1.amazonaws.com/' + url);
      return true;
    });
}

export async function UploadProfileImage(
  userId,
  file,
  setImageUrl,
  setProgress,
) {
  const re = /(?:\.([^.]+))?$/;
  const ext = re.exec(file.fileName);
  console.log(ext);
  const url = `users/${userId}/profile${ext[0]}`;
  const arrayBuffer = decode(file.base64);
  const params = {
    Body: arrayBuffer,
    Bucket: S3_BUCKET,
    Key: url,
  };

  myBucket
    .putObject(params)
    .on('httpUploadProgress', evt => {
      setProgress(Math.round((evt.loaded / evt.total) * 100));
    })
    .send(err => {
      if (err) console.log('err image upload: ', err);
      setImageUrl('https://columbus-test.s3.eu-central-1.amazonaws.com/' + url);
      return true;
    });
}
