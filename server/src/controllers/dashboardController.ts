import { Request, Response } from 'express';
import Story from '../models/Story';
import User from '../models/User';
import { startOfDay, subDays, format } from 'date-fns';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const timeRange = req.query.timeRange || 'week';
    const daysToLookBack = timeRange === 'day' ? 7 : timeRange === 'week' ? 4 : 12;

    // Get total stories and listeners
    const totalStories = await Story.countDocuments();
    const totalListeners = await User.countDocuments();

    // Get upload stats
    const uploadStats = await Promise.all(
      Array.from({ length: daysToLookBack }).map(async (_, index) => {
        const date = subDays(new Date(), index);
        const startOfTheDay = startOfDay(date);
        const count = await Story.countDocuments({
          createdAt: {
            $gte: startOfTheDay,
            $lt: new Date(startOfTheDay.getTime() + 24 * 60 * 60 * 1000)
          }
        });
        return {
          date: format(date, timeRange === 'day' ? 'MMM dd' : 'MMM dd'),
          count
        };
      })
    );

    // Get top stories
    const topStories = await Story.find()
      .sort({ plays: -1 })
      .limit(5)
      .select('title plays duration createdAt');

    const stats = {
      totalStories,
      totalListeners,
      uploadStats: uploadStats.reverse(),
      topStories: topStories.map(story => ({
        title: story.title,
        plays: story.plays,
        duration: story.duration,
        uploadDate: story.createdAt
      }))
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};
