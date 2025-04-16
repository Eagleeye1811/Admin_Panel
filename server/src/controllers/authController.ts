import { Request, Response } from 'express';
import Admin, { IAdmin } from '../models/Admin';
import generateToken from '../utils/generateToken';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const userExists: IAdmin | null = await Admin.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'Admin already exists' });
      return;
    }
    
    const admin = await Admin.create({ email, password });
    res.status(201).json({
      token: generateToken(String(admin._id)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    res.status(200).json({
      token: generateToken(String(admin._id)),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};
