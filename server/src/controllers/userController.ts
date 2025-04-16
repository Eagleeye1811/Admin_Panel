import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select('-password') // Exclude the password field
      .sort({ createdAt: -1 }); // Sort by creation date
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, isActive } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      isActive: isActive ?? true,
    });

    const savedUser = await user.save();
    const { password: _, ...userResponse } = savedUser.toObject();
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Update user status
export const updateUserStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (email) user.email = email;
    if (typeof isActive !== 'undefined') user.isActive = isActive;

    const updatedUser = await user.save();
    const { password: _, ...userResponse } = updatedUser.toObject(); // Exclude password
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};