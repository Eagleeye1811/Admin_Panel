import express from 'express';
import { authMiddleware } from '../middleware/passportMiddleware';
import {
  getAllStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
} from '../controllers/storyController';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getAllStories);
router.get('/:id', getStoryById);
router.post('/', createStory);
router.put('/:id', updateStory);
router.delete('/:id', deleteStory);

export default router;