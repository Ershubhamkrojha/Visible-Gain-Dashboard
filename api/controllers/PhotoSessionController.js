// // controllers/photoSessionController.js
// import PhotoSessionSchema from '../models/PhotoSessionSchema'; // Adjust the import based on your file structure

// export const handlePhotoSessions = async (req, res,next) => {
//     try {
//         if (req.method === 'POST') {
//             // Create a new photo session
//             const { title, description } = req.body; // Get title and description from request body
//             const image = req.file.path; // Get image path from multer

//             const newPhotoSession = await PhotoSessionSchema.create({
//                 title,
//                 description,
//                 image,
//             });

//             return res.status(201).json({
//                 success: true,
//                 message: 'Photo session created successfully',
//                 data: newPhotoSession,
//             });
//         } else if (req.method === 'GET') {
//             // Retrieve all photo sessions
//             const photoSessions = await PhotoSessionSchema.findAll();

//             return res.status(200).json({
//                 success: true,
//                 data: photoSessions,
//             });
//         } else {
//             // Method Not Allowed
//             return res.status(405).json({
//                 success: false,
//                 message: 'Method Not Allowed',
//             });
//         }
//     } catch (error) {
//         console.error('Error handling photo sessions:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Failed to process request',
//             error: error.message,
//         });
//     }
// };
// controllers/photoSessionController.js
import PhotoSessionSchema from '../models/PhotoSessionSchema.js'; 

import { cloudinaryUpload } from '../services/cloudnary.js';
import { deleteCloudinaryImage } from '../services/cloudnary.js';
import cloudinary from 'cloudinary';
export const createPhotoSession = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        // Check if file is present
        if (!req.file) {
            return res.status(400).json({ message: 'Image upload failed, no file provided.' });
        }

        // Upload image to Cloudinary
        const uploadResult = await cloudinaryUpload(req.file.path, `photoSessions/${req.file.filename}`);
console.log(uploadResult)
        if (!uploadResult) {
            return res.status(500).json({ message: 'Failed to upload image to Cloudinary.' });
        }

        // Create a new photo session with the uploaded image URL
        const newPhotoSession = await PhotoSessionSchema.create({
            title,
            description,
            image: uploadResult.secure_url, // Save Cloudinary URL in the database
        });

        res.status(201).json({
            message: 'Photo session created successfully!',
            data: newPhotoSession,
        });
    } catch (error) {
        console.error('Error creating photo session:', error);
        res.status(500).json({ message: error.message });
    }
};


// Get all photo sessions
export const getPhotoSessions = async (req, res,next) => {
    try {
        const sessions = await PhotoSessionSchema.findAll();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single photo session by ID
export const getPhotoSessionById = async (req, res,next) => {
    try {
        const session = await PhotoSessionSchema.findByPk(req.params.id);
        if (!session) return res.status(404).json({ message: "Session not found" });
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a photo session by ID
// Update a photo session by ID




export const updatePhotoSession = async (req, res, next) => {
    const { title, description } = req.body;
    const sessionId = req.params.id;

    try {
        const session = await PhotoSessionSchema.findByPk(sessionId);
        if (!session) return res.status(404).json({ message: "Session not found" });

        let imageUrl = session.image; // Default to existing image

        if (req.file) {
            // If there's an existing image, attempt to delete it
            if (session.image) {
                const publicId = imageUrl.replace(
                    /https?:\/\/res\.cloudinary\.com\/diayinl3q\/image\/upload\/v\d+\/(.*)\.(jpeg|jpg|png|gif|webp)$/,
                    '$1'
                );

                console.log(`Attempting to delete Cloudinary image with public ID: ${publicId}`);
                
                const cloudinaryResult = await deleteCloudinaryImage(publicId);
                
                // Log the result and check for 'not found' cases
                if (cloudinaryResult.result === 'not found') {
                    console.warn(`Image with public ID ${publicId} was not found in Cloudinary`);
                } else {
                    console.log(`Cloudinary delete result: ${cloudinaryResult.result}`);
                }
            }

            // Upload the new image to Cloudinary
            const uploadResult = await cloudinaryUpload(req.file.path, `photoSessions/${req.file.filename}`);
            if (uploadResult) {
                imageUrl = uploadResult.secure_url;
            }
        }

        // Update the session with new data
        const updatedData = {
            title: title || session.title,
            description: description || session.description,
            image: imageUrl,
        };

        await session.update(updatedData);

        res.status(200).json({
            success: true,
            data: updatedData,
        });
    } catch (error) {
        console.error("Error updating photo session:", error);
        res.status(500).json({ message: error.message });
    }
};





// Delete a photo session by ID
export const deletePhotoSession = async (req, res) => {
    const { id } = req.params;
  
    try {
      const session = await PhotoSessionSchema.findByPk(id);
      if (!session) {
        return res.status(404).json({ message: 'Photo session not found' });
      }
     const imageUrl = session.image; // The full URL
      const publicId = imageUrl.replace(/https?:\/\/res\.cloudinary\.com\/diayinl3q\/image\/upload\/v\d+\/(.*)\.(jpeg|jpg|png|gif|webp)$/, '$1');
      // Assuming session.image contains the public ID
      console.log('Deleting Cloudinary image with public ID:', publicId);
      
      // Delete from Cloudinary
      const cloudinaryResult = await deleteCloudinaryImage(publicId);
      console.log('Cloudinary delete result:', cloudinaryResult);
  
      // Delete from database
      await PhotoSessionSchema.destroy({ where: { sessionId: id } });
  
      res.status(200).json({ message: 'Photo session deleted successfully' });
    } catch (error) {
      console.error('Error deleting photo session:', error);
      res.status(500).json({ message: 'Error deleting photo session', error });
    }
  };
  