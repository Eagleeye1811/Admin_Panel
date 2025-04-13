import { Request, Response } from 'express';
import Category from '../models/Category';
import Story from '../models/Story';

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get category by ID
export const getCategoryById = async (req: Request, res: Response): Promise<any> => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, subcategories, isActive } = req.body;

    const category = new Category({
      name,
      subcategories,
      isActive,
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Update category
export const updateCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, subcategories } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if new name already exists (excluding current category)
    const nameExists = await Category.findOne({ 
      _id: { $ne: req.params.id }, 
      name: name.trim() 
    });
    if (nameExists) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    category.name = name.trim();
    category.subcategories = Array.isArray(subcategories) ? 
      subcategories.filter(s => s.trim()) : [];

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete category
export const deleteCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const categoryId = req.params.id;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if category is used in stories
    const storiesUsingCategory = await Story.findOne({ category: categoryId });
    if (storiesUsingCategory) {
      return res.status(409).json({ 
        message: 'Cannot delete category that is being used in stories' 
      });
    }

    await Category.findByIdAndDelete(categoryId);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting category',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};