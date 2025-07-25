// import path from "path";
// import fs from "fs";
const path = require('path');
const fs = require('fs');
module.exports.uploadToCloudinary = async (file)=> {
  try {
  // console.log("file cloudinary",file)
  const localFileFath = path.join(file.path)
  // console.log(localFileFath, 'localFileFath')
  const localFile  = fs.readFileSync(localFileFath)
  const mimeType = file.mimetype; // Example: 'image/png', 'image/gif', etc.
  const imageBlob = new Blob([localFile], { type: mimeType });
  const formData = new FormData();
  formData.append('file', imageBlob);
  formData.append('cloud_name', 'dtbxcjgyg');
  formData.append('upload_preset', 'ProfilePic'); 
  // console.log(formData)
    const url =  process.env.CLOUDINARY_URL
    // console.log(url, 'url')
    const response = await fetch(url,{
      method:'POST',
      body:formData
    })

    // console.log(response, 'response')
    // console.log(response.status, 'response status')
    // console.log("fomdata",formData)
    const img = await response.json()
    // console.log(img, 'img')
      return img
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
