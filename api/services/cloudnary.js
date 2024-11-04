

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
 // Use import if you're using ES modules


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const deleteCloudinaryImage = async (publicId) => {
    try {
      console.log(`Deleting Cloudinary image with public ID: ${publicId}`);
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Cloudinary delete result:', result);
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new Error('Cloudinary deletion failed');
    }
  };
  
  
export const cloudinaryUpload = async (localFilePath, publicID) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            public_id: publicID,
            resource_type: 'auto',
            folder: 'visibledashboardImage',
        });
        
        fs.unlinkSync(localFilePath); // Delete local file only after successful upload
        return response;
    } catch (error) {
        console.error('Cloudinary upload failed:', error);
        return null;
    }
};

