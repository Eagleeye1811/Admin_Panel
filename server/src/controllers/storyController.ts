import { Request, Response } from 'express';
import Story from '../models/Story';

/**
 * Get all stories with populated category name.
 */
export const getAllStories = async (req: Request, res: Response) => {
  try {
    const stories = await Story.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories' });
  }
};

/**
 * Get a single story by ID with category name.
 */
export const getStoryById = async (req: Request, res: Response): Promise<any> => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('category', 'name');

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching story' });
  }
};

/**
 * Create a new story. Assumes req.user is set by auth middleware.
 */
export const createStory = async (req: Request, res: Response) => {
  try {
    const { title, description, audioUrl, category, duration, isActive } = req.body;

    const story = new Story({
      title,
      description,
      audioUrl,
      category,
      duration,
      isActive,
      createdBy: req.user?._id,
    });

    const savedStory = await story.save();
    res.status(201).json(savedStory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating story' });
  }
};

/**
 * Update an existing story.
 */
export const updateStory = async (req: Request, res: Response): Promise<any> => {
  try {
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).populate('category', 'name');

    if (!updatedStory) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json(updatedStory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating story' });
  }
};

/**
 * Delete a story by ID.
 */
export const deleteStory = async (req: Request, res: Response): Promise<any> => {
  try {
    const story = await Story.findByIdAndDelete(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story' });
  }
};
