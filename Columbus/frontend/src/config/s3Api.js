import AWS from 'aws-sdk'

const S3_BUCKET ='columbus-test';
const REGION ='eu-central-1';


AWS.config.update({
    accessKeyId: 'AKIA2SPVCAGPCLCMIDIG',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})

export function UploadImage(guid, file, setImageUrl, setProgress) {
    const re = /(?:\.([^.]+))?$/;
    const ext = re.exec(file.name)
    console.log(ext);
    const url = `posts/${guid}${ext[0]}`

    const params = {
        Body: file,
        Bucket: S3_BUCKET,
        Key: url
    };

    myBucket.putObject(params)
        .on('httpUploadProgress', (evt) => {
            setProgress(Math.round((evt.loaded / evt.total) * 100))
        })
        .send((err) => {
            if (err) console.log(err)
            setImageUrl("https://columbus-test.s3.eu-central-1.amazonaws.com/" + url)
        })   
}