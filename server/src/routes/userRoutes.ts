import express from 'express';
import { authMiddleware } from '../middleware/passportMiddleware';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserStatus,
  deleteUser,
} from '../controllers/userController';

const router = express.Router();
router.use(authMiddleware);

router.get('/', getAllUsers); // Get all users
router.get('/:id', getUserById); // Get user by ID
router.post('/', createUser); // Create a new user
router.put('/:id/status', updateUserStatus); // Update user status
router.delete('/:id', deleteUser); // Delete a user

export default router;

