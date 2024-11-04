// routes/photoSessions.js
import {upload} from '../services/multer.js'
import express from 'express';
import {
    createPhotoSession,
    getPhotoSessions,
    getPhotoSessionById,
    updatePhotoSession,
    deletePhotoSession
} from '../controllers/PhotoSessionController.js';

const router = express.Router();


// Define routes
router.post('/create', upload.single('image'), createPhotoSession);
router.get('/', getPhotoSessions); // Get all photo sessions
router.get('/:id', getPhotoSessionById); // Get a single photo session by ID
router.put('/:id', upload.single('image'), updatePhotoSession); // Update a photo session with optional image update
router.delete('/:id', deletePhotoSession); // Delete a photo session by ID

export default router;
