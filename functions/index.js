const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');

admin.initializeApp();
const gcs = new Storage();

exports.generateThumbnail = functions.storage.object().onFinalize(async (object) => {
  try{
    const filePath = object.name;
    if(!filePath.includes('/processed/')) return null;
    const bucket = gcs.bucket(object.bucket);
    const tmpFile = `/tmp/${Date.now()}_thumb.jpg`;
    const file = bucket.file(filePath);
    const [buf] = await file.download();
    const thumbBuf = await sharp(buf).resize(400).jpeg().toBuffer();
    const thumbPath = filePath.replace(/(\.[^.]+$)/,'_thumb.jpg');
    const thumbFile = bucket.file(thumbPath);
    await thumbFile.save(thumbBuf, { contentType: 'image/jpeg' });
  }catch(err){
    console.error('thumbnail error', err);
  }
  return null;
});
