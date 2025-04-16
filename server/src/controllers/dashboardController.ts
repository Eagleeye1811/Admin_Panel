import { Request, Response } from 'express';
import Story from '../models/Story';
import User from '../models/User';
import Category from '../models/Category';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalStories = await Story.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalCategories = await Category.countDocuments();

    const uploadStats = await Story.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $addFields: {
          date: "$_id"
        }
      },
      {
        $project: { _id: 0, date: 1, count: 1 }
      }
    ]);

    res.status(200).json({
      totalStories,
      totalUsers,
      totalCategories,
      uploadStats,
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};
